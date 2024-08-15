import {TwinClass, TwinClassStatus} from "@/lib/api/api-types";
import {useContext, useEffect, useRef, useState} from "react";
import {ApiContext} from "@/lib/api/api";
import {toast} from "sonner";
import {Button} from "@/components/base/button";
import {Edit2Icon, Unplug} from "lucide-react";
import CreateEditTwinStatusDialog from "@/app/twinclass/[twinClassId]/twin-status-dialog";
import {ShortGuidWithCopy} from "@/components/base/short-guid";
import {ColumnDef, PaginationState} from "@tanstack/table-core";
import {ImageWithFallback} from "@/components/image-with-fallback";
import {DataTableHandle} from "@/components/base/data-table/data-table";
import {CrudDataTable, FiltersState} from "@/components/base/data-table/crud-data-table";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/base/tooltip";
import {TwinClassContext} from "@/app/twinclass/[twinClassId]/twin-class-context";

export function TwinClassStatuses() {
    const api = useContext(ApiContext);
    const {twinClass, fetchClassData} = useContext(TwinClassContext);
    const tableRef = useRef<DataTableHandle>(null);
    const [createEditStatusDialogOpen, setCreateEditStatusDialogOpen] = useState<boolean>(false);
    const [editedStatus, setEditedStatus] = useState<TwinClassStatus | null>(null);

    const columns: ColumnDef<TwinClassStatus>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()}/>
        },
        {
            accessorKey: "key",
            header: "Key",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "color",
            header: "Color",
            cell: (data) => {
                return <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="w-4 h-4 rounded" style={{backgroundColor: data.getValue<string>()}}/>
                    </TooltipTrigger>
                    <TooltipContent>{data.getValue<string>()}</TooltipContent>
                </Tooltip>
            }
        },
        {
            accessorKey: "logo",
            header: "Logo",
            cell: (data) => {
                const value = data.row.original.logo;
                return <ImageWithFallback src={value as string} alt={value as string} fallbackContent={<Unplug/>}
                                          width={32} height={32} className="text-[0]"/>;
            }
        },
        {
            header: "Actions",
            cell: (data) => {
                return <Button variant="ghost" size="iconS6"
                        onClick={() => editStatus(data.row.original)}><Edit2Icon/>
                </Button>
            }
        }
    ]

    async function fetchStatuses(_: PaginationState, filters: FiltersState) {
        if (!twinClass?.id) {
            toast.error("Twin class ID is missing");
            return {data: [], pageCount: 0}
        }

        try {
            const response = await api.twinClass.getById({
                id: twinClass.id, query: {
                    showTwinClassMode: 'SHORT',
                    // showTwin2TwinClassMode: 'SHORT',
                    showTwin2StatusMode: 'DETAILED',
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
            return {
                data: values,
                pageCount: 0
            }
        } catch (e) {
            console.error('exception while fetching twin class fields', e)
            toast.error("Failed to fetch twin class fields")
            return {data: [], pageCount: 0};
        }
    }

    function createStatus() {
        setEditedStatus(null);
        setCreateEditStatusDialogOpen(true);
    }

    function editStatus(status: TwinClassStatus) {
        setEditedStatus(status);
        setCreateEditStatusDialogOpen(true);
    }

    function onChangeSuccess() {
        fetchClassData()
        tableRef.current?.refresh()
    }

    if (!twinClass) {
        console.error('TwinClassFields: no twin class')
        return;
    }

    return <>
        <CrudDataTable
            ref={tableRef}
            title='Statuses'
            columns={columns}
            getRowId={(row) => row.key!}
            fetcher={fetchStatuses}
            createButton={{
                enabled: true,
                onClick: createStatus,
            }}
            disablePagination={true}
            pageSizes={[10, 20, 50]}
        />

        <CreateEditTwinStatusDialog open={createEditStatusDialogOpen} twinClassId={twinClass.id!} status={editedStatus}
                                    onOpenChange={setCreateEditStatusDialogOpen}
                                    onSuccess={onChangeSuccess}/>
    </>
}