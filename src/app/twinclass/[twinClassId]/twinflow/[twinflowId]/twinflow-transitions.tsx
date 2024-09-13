import {TwinClassField, TwinClassStatus, TwinFlow, TwinFlowTransition} from "@/lib/api/api-types";
import {useContext, useEffect, useRef, useState} from "react";
import {DataTableHandle} from "@/components/base/data-table/data-table";
import {ColumnDef} from "@tanstack/table-core";
import {ShortGuidWithCopy} from "@/components/base/short-guid";
import {CrudDataTable} from "@/components/base/data-table/crud-data-table";
import {
    TwinflowTransitionCreateEditDialog
} from "@/app/twinclass/[twinClassId]/twinflow/[twinflowId]/twinflow-transition-dialog";
import {useRouter} from "next/navigation";
import {TwinClassContext} from "@/app/twinclass/[twinClassId]/twin-class-context";


export function TwinflowTransitions({twinflow, onChange}: {twinflow: TwinFlow, onChange: () => any}) {
    const {twinClass} = useContext(TwinClassContext);
    const [createEditTransitionDialogOpen, setCreateEditTransitionDialogOpen] = useState<boolean>(false);
    const [editedTransition, setEditedTransition] = useState<TwinClassField | null>(null);
    const router = useRouter()
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
            cell: (data) => {
                const status = data.getValue<TwinClassStatus>();
                return status?.name ?? status?.key
            }
        },
        // {
        //     header: "Actions",
        //     cell: (data) => {
        //         return <Button variant="ghost" size="iconS6" onClick={() => openEditTransitionDialog(data.row.original)}><Edit2Icon/></Button>
        //     }
        // }
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
            onRowClick={(row) => router.push(`/twinclass/${twinClass!.id!}/twinflow/${twinflow.id}/transition/${row.id}`)}
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