import {
    TwinClass,
    TwinClassField,
    TwinClassStatus,
    TwinFlow,
    TwinFlowTransition,
    TwinFlowTransitionCreateRq
} from "@/lib/api/api-types";
import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {ApiContext} from "@/lib/api/api";
import {DataTableHandle} from "@/components/base/data-table/data-table";
import {Button} from "@/components/base/button";
import {toast} from "sonner";
import {LoadingSpinner} from "@/components/base/loading";
import {ColumnDef} from "@tanstack/table-core";
import {ShortGuidWithCopy} from "@/components/base/short-guid";
import {CrudDataTable} from "@/components/base/data-table/crud-data-table";
import {Table, TableBody, TableCell, TableRow} from "@/components/base/table";
import {Edit2Icon} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/base/dialog";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/base/form";
import {Input} from "@/components/base/input";
import {ComboboxFormField, TextFormField} from "@/components/form-fields";
import {Alert} from "@/components/base/alert";

export function TwinClassTwinflow({twinClass}: { twinClass: TwinClass }) {
    const api = useContext(ApiContext);
    const [twinflows, setTwinflows] = useState<TwinFlow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [nextPage, setNextPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const pageSize = 5;

    const [createEditTransitionDialogOpen, setCreateEditTransitionDialogOpen] = useState<boolean>(false);
    const [createEditDialogTwinflow, setCreateEditDialogTwinflow] = useState<TwinFlow | null>(null);
    const [editedTransition, setEditedTransition] = useState<TwinClassField | null>(null);

    async function fetchNextTwinflow() {
        if (nextPage >= totalPages) return;
        setLoading(true);
        try {
            const response = await api.twinflow.search({twinClassId: twinClass.id!, offset: nextPage * pageSize})
            setTwinflows(response.data?.twinflowList ?? []);
            setNextPage((old) => old + 1);
            setTotalPages(Math.ceil((response.data?.pagination?.total ?? 0) / pageSize));
        } catch (e) {
            console.error('Failed to fetch twin flows', e);
            toast.error("Failed to fetch twin flows");
        } finally {
            setLoading(false);
        }
    }

    async function fetchDialogTwinflow() {
        try {
            const response = await api.twinflow.getById({twinFlowId: createEditDialogTwinflow!.id!})
            if (!response.data?.twinflow) {
                toast.warning("Failed to fetch updated twinflow");
                return;
            }
            setTwinflows(old => {
                const index = old.findIndex(twinflow => twinflow.id === response.data?.twinflow?.id);
                if (index === -1) return old;
                old[index] = response.data.twinflow!;
                return [...old];
            })
        } catch (e) {
            console.error('Failed to fetch updated twinflow', e);
            toast.error("Failed to fetch updated twinflow");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchNextTwinflow();
    }, []);

    function openCreateTransitionDialog(twinflow: TwinFlow) {
        setCreateEditDialogTwinflow(twinflow);
        setEditedTransition(null);
        setCreateEditTransitionDialogOpen(true);
    }

    function openEditTransitionDialog(twinflow: TwinFlow, transition: TwinFlowTransition) {
        setCreateEditDialogTwinflow(twinflow);
        setEditedTransition(transition);
        setCreateEditTransitionDialogOpen(true);
    }

    return <>
        {!loading && twinflows.length == 0 && <>
            This class doesn&apos;t have twin flows
        </>}
        {twinflows.map(twinflow => {
            return <TwinflowView key={twinflow.id!} twinflow={twinflow}
                                 onCreate={() => openCreateTransitionDialog(twinflow)}
                                 onEdit={(transition) => openEditTransitionDialog(twinflow, transition)}
            />
        })}
        {loading && <LoadingSpinner/>}
        {!loading && nextPage < totalPages && <Button onClick={fetchNextTwinflow}>Load more</Button>}

        <TwinflowTransitionCreateEditDialog
            open={createEditTransitionDialogOpen}
            twinClassId={twinClass.id!}
            twinFlow={createEditDialogTwinflow ?? undefined}
            transition={editedTransition}
            onOpenChange={setCreateEditTransitionDialogOpen}
            onSuccess={fetchDialogTwinflow}
        />
    </>
}

function TwinflowView({twinflow, onCreate, onEdit}: {
    twinflow: TwinFlow,
    onCreate?: () => any,
    onEdit?: (transition: TwinFlowTransition) => any
}) {
    const tableRef = useRef<DataTableHandle>(null);

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
                return <Button variant="ghost" size="iconTiny" onClick={() => onEdit?.(data.row.original)}><Edit2Icon/></Button>
            }
        }
    ]

    useEffect(() => {
        getTransitionsRef.current = getTransitions;
        tableRef.current?.refresh();
    }, [twinflow])

    function getTransitions() {
        return Promise.resolve({data: Object.values(twinflow.transitions ?? {}), pageCount: 0});
    }

    const getTransitionsRef = useRef(getTransitions);

    return <div className="p-4 border rounded">
        <h1 className="text-xl font-bold">{twinflow.name}</h1>
        <Table className="mt-8">
            <TableBody>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>{twinflow.id}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>{twinflow.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>{twinflow.description}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Initial status</TableCell>
                    <TableCell>{twinflow.initialStatus?.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Created at</TableCell>
                    <TableCell>{twinflow.createdAt}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
        <CrudDataTable
            ref={tableRef}
            className="mt-4"
            title="Transitions"
            createButton={{
                enabled: true,
                onClick: onCreate
            }}
            hideRefresh={true}
            columns={columns} getRowId={x => x.id!}
            fetcher={() => getTransitionsRef.current()}
            disablePagination={true}
        />
    </div>
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