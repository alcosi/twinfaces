import {TwinClass, TwinFlow} from "@/lib/api/api-types";
import {useContext, useRef, useState} from "react";
import {toast} from "sonner";
import {ApiContext} from "@/lib/api/api";
import {CrudDataTable, FiltersState} from "@/components/base/data-table/crud-data-table";
import {useRouter} from "next/navigation";
import {ColumnDef, PaginationState} from "@tanstack/table-core";
import {ShortGuidWithCopy} from "@/components/base/short-guid";
import {DataTableHandle} from "@/components/base/data-table/data-table";
import CreateTwinflowDialog from "@/app/twinclass/[twinClassId]/twin-class-twinflow-dialog";

const columns: ColumnDef<TwinFlow>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: (data) => <ShortGuidWithCopy value={data.row.original.id}/>
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
        accessorKey: "initialStatus",
        header: "Initial status",
        cell: (data) => <>{data.row.original.initialStatus?.name}</>
    }
]

export function TwinClassTwinflows({twinClass}: { twinClass: TwinClass }) {
    const [twinflowDialogOpen, setTwinflowDialogOpen] = useState(false)
    const api = useContext(ApiContext);
    const router = useRouter()
    const tableRef = useRef<DataTableHandle>(null);

    async function fetchTwinflows(pagination: PaginationState, filters: FiltersState) {
        try {
            const {data, error} = await api.twinflow.search({twinClassId: twinClass.id!, pagination})
            if (error) {
                console.error('failed to fetch twinflows', error)
                toast.error("Failed to fetch twinflows")
                return {
                    data: [],
                    pageCount: 0
                }
            }

            return {
                data: data.twinflowList ?? [],
                pageCount: Math.ceil((data.pagination?.total ?? 0) / pagination.pageSize)
            }
        } catch (e) {
            console.error('Failed to fetch twinflow', e);
            toast.error("Failed to fetch twinflow");
            return {
                data: [],
                pageCount: 0
            }
        }
    }

    function openCreateTwinflow() {
        setTwinflowDialogOpen(true);
    }

    return <>
        <CrudDataTable
            ref={tableRef}
            columns={columns}
            getRowId={(row) => row.id!}
            fetcher={fetchTwinflows}
            pageSizes={[10, 20, 50]}
            onRowClick={(row) => router.push(`/twinclass/${row.twinClassId}/twinflow/${row.id}`)}
            createButton={{enabled: true, onClick: openCreateTwinflow, text: 'Create Twinflow'}}
            // search={{enabled: true, placeholder: 'Search by key...'}}
        />
        <CreateTwinflowDialog open={twinflowDialogOpen}
                              onOpenChange={setTwinflowDialogOpen}
                              twinClassId={twinClass.id!}
                              onSuccess={tableRef.current?.refresh}
        />
    </>

}