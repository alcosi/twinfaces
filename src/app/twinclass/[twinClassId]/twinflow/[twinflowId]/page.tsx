'use client'

import {Section, SideNavLayout} from "@/components/SideNavLayout";
import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {
    TwinClass, TwinClassField,
    TwinClassStatus,
    TwinFlow,
    TwinFlowTransition,
    TwinFlowTransitionCreateRq,
    TwinFlowUpdateRq
} from "@/lib/api/api-types";
import {ApiContext} from "@/lib/api/api";
import {toast} from "sonner";
import {LoadingOverlay} from "@/components/base/loading";
import {Table, TableBody, TableCell, TableRow} from "@/components/base/table";
import {AutoDialog, AutoEditDialogSettings} from "@/components/AutoDialog";
import {AutoFormValueType} from "@/components/AutoField";
import {CrudDataTable} from "@/components/base/data-table/crud-data-table";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/base/dialog";
import {Form} from "@/components/base/form";
import {Input} from "@/components/base/input";
import {ComboboxFormField} from "@/components/form-fields/combobox-form-field";
import {TextFormField} from "@/components/form-fields/text-form-field";
import {Alert} from "@/components/base/alert";
import {Button} from "@/components/base/button";
import {DataTableHandle} from "@/components/base/data-table/data-table";
import {ColumnDef} from "@tanstack/table-core";
import {ShortGuidWithCopy} from "@/components/base/short-guid";
import {Edit2Icon} from "lucide-react";

interface TwinflowPageProps {
    params: {
        twinflowId: string
    }
}

export default function TwinflowPage({params: {twinflowId}}: TwinflowPageProps) {
    const api = useContext(ApiContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [twinflow, setTwinflow] = useState<TwinFlow | undefined>(undefined);

    useEffect(() => {
        fetchTwinflowData()
    }, [])

    function fetchTwinflowData() {
        setLoading(true);
        api.twinflow.getById({
            twinFlowId: twinflowId
        }).then((response) => {
            const data = response.data;
            if (!data || data.status != 0) {
                console.error('failed to fetch twin class', data)
                let message = "Failed to load twin class";
                if (data?.msg) message += `: ${data.msg}`;
                toast.error(message);
                return;
            }
            setTwinflow(data.twinflow);
        }).catch((e) => {
            console.error('exception while fetching twin class', e)
            toast.error("Failed to fetch twin class")
        }).finally(() => setLoading(false))
    }

    const sections: Section[] = twinflow ? [
        {
            key: 'general',
            label: 'General',
            content: <TwinflowGeneral twinflow={twinflow} onChange={fetchTwinflowData}/>
        },
        {
            key: 'transitions',
            label: 'Transitions',
            content: <TwinflowTransitions twinflow={twinflow} onChange={fetchTwinflowData}/>
        }
    ] : []

    return <div>
        {loading && <LoadingOverlay/>}
        {twinflow && <SideNavLayout sections={sections} returnOptions={{
            path: `/twinclass/${twinflow.twinClassId}`,
            label: 'Back to class'
        }}>
            <h1 className="text-xl font-bold">{twinflow.name}</h1>
        </SideNavLayout>}
    </div>
}

function TwinflowGeneral({twinflow, onChange}: { twinflow: TwinFlow, onChange: () => any }) {
    const api = useContext(ApiContext);
    const [statuses, setStatuses] = useState<TwinClassStatus[]>([])
    const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
    const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] = useState<AutoEditDialogSettings | undefined>(undefined);

    useEffect(() => {
        fetchStatuses()
    }, [twinflow]);

    async function fetchStatuses() {
        const response = await api.twinClass.getById({
            id: twinflow.twinClassId!, query: {
                showTwinClassMode: 'SHORT',
                // showTwin2TwinClassMode: 'SHORT',
                // showTwin2StatusMode: 'SHORT',
                showTwinClass2StatusMode: 'DETAILED'
            }
        });

        const data = response.data;
        if (!data || data.status != 0) {
            console.error('failed to fetch twin class fields', data)
            let message = "Failed to load twin class fields";
            if (data?.msg) message += `: ${data.msg}`;
            toast.error(message);
            return {data: [], pageCount: 0};
        }

        const values = Object.values(data.twinClass?.statusMap ?? {});
        setStatuses(values);
    }

    async function updateTwinFlow(newFlow: TwinFlowUpdateRq) {
        try {
            await api.twinflow.update({id: twinflow.id!, body: newFlow});
            console.log('updated');
            onChange?.();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async function getStatusesBySearch(search: string) {
        return statuses.filter(status =>
            (status.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (status.key ?? '').toLowerCase().includes(search.toLowerCase())
        );
    }

    async function findStatusById(id: string) {
        console.log('findStatusById', id, statuses)
        return statuses.find(x => x.id === id);
    }

    const autoDialogSettings: { [key: string]: AutoEditDialogSettings } = {
        name: {
            value: {"name": twinflow.name},
            title: 'Update name',
            onSubmit: (values) => {
                return updateTwinFlow({nameI18n: {translationInCurrentLocale: values.name}})
            },
            valuesInfo: {
                "name": {
                    type: AutoFormValueType.string, label: "Name"
                }
            }
        },
        description: {
            value: {"description": twinflow.description},
            title: 'Update description',
            onSubmit: (values) => {
                return updateTwinFlow({descriptionI18n: {translationInCurrentLocale: values.description}})
            },
            valuesInfo: {
                "description": {
                    type: AutoFormValueType.string, label: "Description"
                }
            }
        },
        initialStatusId: {
            value: {"initialStatusId": twinflow.initialStatusId},
            title: 'Update initial status',
            onSubmit: (values) => {
                return updateTwinFlow({initialStatusId: values.initialStatusId})
            },
            valuesInfo: {
                "initialStatusId": {
                    type: AutoFormValueType.combobox,
                    label: "Initial status",
                    getItems: getStatusesBySearch,
                    getItemKey: (c) => c?.id?.toLowerCase() ?? "",
                    getItemLabel: (c) => {
                        let label = c?.key ?? "";
                        if (c.name) label += ` (${c.name})`
                        return label;
                    },
                    getById: findStatusById,
                    selectPlaceholder: "Select status...",
                }
            }
        }
    }

    function openWithSettings(settings: AutoEditDialogSettings) {
        setCurrentAutoEditDialogSettings(settings)
        setEditFieldDialogOpen(true)
    }

    return <>
        <Table className="mt-8">
            <TableBody>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>{twinflow.id}</TableCell>
                </TableRow>
                <TableRow className="cursor-pointer" onClick={() => openWithSettings(autoDialogSettings.name!)}>
                    <TableCell>Name</TableCell>
                    <TableCell>{twinflow.name}</TableCell>
                </TableRow>
                <TableRow className="cursor-pointer" onClick={() => openWithSettings(autoDialogSettings.description!)}>
                    <TableCell>Description</TableCell>
                    <TableCell>{twinflow.description}</TableCell>
                </TableRow>
                <TableRow className="cursor-pointer"
                          onClick={() => openWithSettings(autoDialogSettings.initialStatusId!)}>
                    <TableCell>Initial status</TableCell>
                    <TableCell>{twinflow.initialStatus?.name ?? twinflow.initialStatus?.key}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Created at</TableCell>
                    <TableCell>{twinflow.createdAt}</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <AutoDialog
            open={editFieldDialogOpen}
            onOpenChange={setEditFieldDialogOpen}
            settings={currentAutoEditDialogSettings}/>
    </>
}

function TwinflowTransitions({twinflow, onChange}: {twinflow: TwinFlow, onChange: () => any}) {
    const [createEditTransitionDialogOpen, setCreateEditTransitionDialogOpen] = useState<boolean>(false);
    const [editedTransition, setEditedTransition] = useState<TwinClassField | null>(null);

    const tableRef = useRef<DataTableHandle>(null);

    const getTransitionsRef = useRef(getTransitions);

    useEffect(() => {
        getTransitionsRef.current = getTransitions;
        tableRef.current?.refresh();
    }, [twinflow])

    function getTransitions() {
        return Promise.resolve({data: Object.values(twinflow.transitions ?? {}), pageCount: 0});
    }

    function openCreateTransitionDialog() {
        setEditedTransition(null);
        setCreateEditTransitionDialogOpen(true);
    }

    function openEditTransitionDialog(transition: TwinFlowTransition) {
        setEditedTransition(transition);
        setCreateEditTransitionDialogOpen(true);
    }

    const columns: ColumnDef<TwinFlowTransition>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()}/>
        },
        {
            accessorKey: "alias",
            header: "Alias",
        },
        {
            accessorKey: "srcTwinStatus",
            header: "From",
            cell: (data) => {
                return data.getValue<TwinClassStatus | undefined>()?.name
            }
        },
        {
            accessorKey: "dstTwinStatus",
            header: "To",
            cell: (data) => {
                return data.getValue<TwinClassStatus | undefined>()?.name
            }
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            header: "Actions",
            cell: (data) => {
                return <Button variant="ghost" size="iconS6" onClick={() => openEditTransitionDialog(data.row.original)}><Edit2Icon/></Button>
            }
        }
    ]

    return <>
        <CrudDataTable
            ref={tableRef}
            className="mt-4"
            title="Transitions"
            createButton={{
                enabled: true,
                onClick: openCreateTransitionDialog,
            }}
            hideRefresh={true}
            columns={columns} getRowId={x => x.id!}
            fetcher={() => getTransitionsRef.current()}
            disablePagination={true}
        />

        <TwinflowTransitionCreateEditDialog
            open={createEditTransitionDialogOpen}
            twinClassId={twinflow.twinClassId!}
            twinFlow={twinflow}
            transition={editedTransition}
            onOpenChange={setCreateEditTransitionDialogOpen}
            onSuccess={onChange}
        />

    </>
}

interface TwinflowTransitionCreateEditDialogProps {
    open: boolean,
    onOpenChange?: (open: boolean) => any,
    twinClassId: string,
    twinFlow?: TwinFlow,
    transition: TwinFlowTransition | null,
    onSuccess?: () => any
}

const twinFlowTransitionSchema = z.object({
    srcStatusId: z.string().optional().or(z.literal('').transform(() => undefined)),
    dstStatusId: z.string().min(1, "Destination status is required"),
    name: z.string().min(0).max(100).optional().or(z.literal('').transform(() => undefined)),
    alias: z.string().optional().or(z.literal('').transform(() => undefined)),
    permissionId: z.string().optional().or(z.literal('').transform(() => undefined)),
})

function TwinflowTransitionCreateEditDialog({
                                                open,
                                                onOpenChange,
                                                twinClassId,
                                                twinFlow,
                                                transition,
                                                onSuccess
                                            }: TwinflowTransitionCreateEditDialogProps) {
    const api = useContext(ApiContext)

    const [error, setError] = useState<string | null>(null)

    const [statuses, setStatuses] = useState<TwinClassStatus[]>([])

    const existingAliases = useMemo(() => {
        if (!twinFlow) return [];
        const transitions = Object.values(twinFlow.transitions ?? {})
        const aliases = transitions.filter(x => x.alias).map(x => x.alias);
        console.log('existingAliases', aliases)
    }, [twinFlow])

    function onOpenChangeInternal(newOpen: boolean) {
        console.log('TwinflowTransitionCreateEditDialog onOpenChangeInternal', newOpen)
        if (!newOpen && form.formState.isSubmitting) {
            return;
        }

        onOpenChange?.(newOpen)
    }

    useEffect(() => {
        console.log('TwinflowTransitionCreateEditDialog useEffect open', open, transition)
        if (!open) return;

        if (transition) {
            form.reset({
                srcStatusId: transition.srcTwinStatusId,
                dstStatusId: transition.dstTwinStatusId,
                name: transition.name,
                alias: transition.alias,
                permissionId: transition.permissionId
            }, {keepDefaultValues: true})
            console.log(form.getValues())
        } else {
            console.log('CreateEditTwinFieldDialog useEffect reset', form.formState.defaultValues)
            form.reset()
        }
        setError(null)
    }, [open])

    const form = useForm<z.infer<typeof twinFlowTransitionSchema>>({
        resolver: zodResolver(twinFlowTransitionSchema),
        defaultValues: {
            srcStatusId: "",
            dstStatusId: "",
            name: "",
            alias: "",
            permissionId: ""
            // descriptor: {
            //     fieldType: ""
            // }
        }
    })

    async function onSubmit(data: z.infer<typeof twinFlowTransitionSchema>) {
        setError(null);

        const requestBody: TwinFlowTransitionCreateRq = {...data}

        if (!transition) {
            try {
                const {data: response, error} = await api.twinflow.createTransition({
                    twinFlowId: twinFlow!.id!,
                    data: requestBody
                })
                if (error) {
                    console.error('failed to create field', error)
                    const errorMessage = error?.msg;
                    setError("Failed to create field: " + errorMessage ?? error)
                    return;
                }
            } catch (e) {
                console.error('exception while creating field', e)
                toast.error("Failed to create field")
                return;
            }
        } else {
            toast.warning("Not implemented yet!")

            // if (!field.id) {
            //     console.error('CRITICAL: Field ID is missing on update method!', field)
            //     setError("Something went wrong, please try again later.")
            //     return
            // }
            //
            // try {
            //     const {data: response, error} = await api.twinClass.updateField({fieldId: field.id, body: requestBody})
            //     if (error) {
            //         console.error('failed to update field', error)
            //         const errorMessage = error?.msg;
            //         setError("Failed to update field: " + errorMessage ?? error)
            //         return;
            //     }
            // } catch (e) {
            //     console.error('exception while updating field', e)
            //     toast.error("Failed to update field")
            //     return;
            // }
        }

        onOpenChange?.(false);
        onSuccess?.();
    }

    useEffect(() => {
        fetchStatuses()
    }, [twinClassId]);

    if (!twinFlow?.id) {
        return;
    }

    async function fetchStatuses() {
        const response = await api.twinClass.getById({
            id: twinClassId, query: {
                showTwinClassMode: 'SHORT',
                // showTwin2TwinClassMode: 'SHORT',
                // showTwin2StatusMode: 'SHORT',
                showTwinClass2StatusMode: 'DETAILED'
            }
        });

        const data = response.data;
        if (!data || data.status != 0) {
            console.error('failed to fetch twin class fields', data)
            let message = "Failed to load twin class fields";
            if (data?.msg) message += `: ${data.msg}`;
            toast.error(message);
            return {data: [], pageCount: 0};
        }

        const values = Object.values(data.twinClass?.statusMap ?? {});
        setStatuses(values);
    }

    async function getStatusesBySearch(search: string) {
        return statuses.filter(status =>
            (status.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (status.key ?? '').toLowerCase().includes(search.toLowerCase())
        );
    }

    async function findStatusById(id: string) {
        console.log('findStatusById', id, statuses)
        return statuses.find(x => x.id === id);
    }

    return <Dialog open={open} onOpenChange={onOpenChangeInternal}>
        <DialogContent className="sm:max-w-md overflow-y-scroll max-h-[100%] sm:max-h-[80%]">
            <DialogHeader>
                <DialogTitle>
                    {transition ? "Edit transition" : "Create transition"}
                </DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {transition?.id && <Input value={transition?.id} disabled/>}

                    {existingAliases}

                    <ComboboxFormField control={form.control} name="srcStatusId" label="Source status"
                                       getById={findStatusById}
                                       getItems={getStatusesBySearch}
                                       getItemKey={(c) => c?.id?.toLowerCase() ?? ""}
                                       getItemLabel={(c) => {
                                           let label = c?.key ?? "";
                                           if (c.name) label += ` (${c.name})`
                                           return label;
                                       }}
                                       selectPlaceholder={"Select status..."}
                                       searchPlaceholder={"Search status..."}
                                       noItemsText={"No statuses found"}
                    />

                    <ComboboxFormField control={form.control} name="dstStatusId" label="Destination status"
                                       getById={findStatusById}
                                       required={true}
                                       getItems={getStatusesBySearch}
                                       getItemKey={(c) => c?.id?.toLowerCase() ?? ""}
                                       getItemLabel={(c) => {
                                           let label = c?.key ?? "";
                                           if (c.name) label += ` (${c.name})`
                                           return label;
                                       }}
                                       selectPlaceholder={"Select status..."}
                                       searchPlaceholder={"Search status..."}
                                       noItemsText={"No statuses found"}
                    />

                    <TextFormField control={form.control} name="name" label="Name"/>

                    <TextFormField control={form.control} name="alias" label="Alias" idPrefix="create-edit-transition"/>

                    <TextFormField control={form.control} name="permissionId" label="Permission ID"/>

                    {error && <Alert variant="destructive">
                        {error}
                    </Alert>}

                    {Object.values(form.formState.errors).length > 0 && <Alert variant="destructive">
                        There are errors in the form
                    </Alert>}

                    <DialogFooter className="sm:justify-end">
                        <Button type="submit" loading={form.formState.isSubmitting}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
}