import {TwinClassStatus, TwinFlow, TwinFlowUpdateRq} from "@/lib/api/api-types";
import {useContext, useEffect, useState} from "react";
import {ApiContext} from "@/lib/api/api";
import {AutoDialog, AutoEditDialogSettings} from "@/components/AutoDialog";
import {toast} from "sonner";
import {AutoFormValueType} from "@/components/AutoField";
import {Table, TableBody, TableCell, TableRow} from "@/components/base/table";

export function TwinflowGeneral({twinflow, onChange}: { twinflow: TwinFlow, onChange: () => any }) {
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

    const nameAutoDialogSettings: AutoEditDialogSettings = {
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
    };
    const descriptionAutoDialogSettings: AutoEditDialogSettings = {
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
    }
    const initialStatusIdAutoDialogSettings: AutoEditDialogSettings = {
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
                <TableRow className="cursor-pointer" onClick={() => openWithSettings(nameAutoDialogSettings)}>
                    <TableCell>Name</TableCell>
                    <TableCell>{twinflow.name}</TableCell>
                </TableRow>
                <TableRow className="cursor-pointer" onClick={() => openWithSettings(descriptionAutoDialogSettings)}>
                    <TableCell>Description</TableCell>
                    <TableCell>{twinflow.description}</TableCell>
                </TableRow>
                <TableRow className="cursor-pointer"
                          onClick={() => openWithSettings(initialStatusIdAutoDialogSettings)}>
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

