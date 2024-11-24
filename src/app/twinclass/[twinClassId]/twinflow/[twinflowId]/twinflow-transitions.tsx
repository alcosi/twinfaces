import { TwinClassContext, TwinClassField } from "@/entities/twinClass";
import { TwinFlow } from "@/entities/twinFlow";
import { TF_Transition } from "@/entities/twinFlowTransition";
import { TwinStatus } from "@/entities/twinStatus";
import { CrudDataTable } from "@/shared/ui/data-table/crud-data-table";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { ShortGuidWithCopy } from "@/shared/ui/short-guid";
import { ColumnDef } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { TwinflowTransitionCreateEditDialog } from "./twinflow-transition-dialog";

export function TwinflowTransitions({
  twinflow,
  onChange,
}: {
  twinflow: TwinFlow;
  onChange: () => any;
}) {
  const { twinClass } = useContext(TwinClassContext);
  const [createEditTransitionDialogOpen, setCreateEditTransitionDialogOpen] =
    useState<boolean>(false);
  const [editedTransition, setEditedTransition] =
    useState<TwinClassField | null>(null);
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);

  const getTransitionsRef = useRef(getTransitions);

  useEffect(() => {
    getTransitionsRef.current = getTransitions;
    tableRef.current?.refresh();
  }, [twinflow]);

  function getTransitions() {
    return Promise.resolve({
      data: Object.values(twinflow.transitions ?? {}),
      pageCount: 0,
    });
  }

  function openCreateTransitionDialog() {
    setEditedTransition(null);
    setCreateEditTransitionDialogOpen(true);
  }

  function openEditTransitionDialog(transition: TF_Transition) {
    setEditedTransition(transition);
    setCreateEditTransitionDialogOpen(true);
  }

  const columns: ColumnDef<TF_Transition>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
    },
    {
      accessorKey: "alias",
      header: "Alias",
    },
    {
      accessorKey: "srcTwinStatus",
      header: "From",
      cell: (data) => {
        return data.getValue<TwinStatus | undefined>()?.name;
      },
    },
    {
      accessorKey: "dstTwinStatus",
      header: "To",
      cell: (data) => {
        return data.getValue<TwinStatus | undefined>()?.name;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (data) => {
        const status = data.getValue<TwinStatus>();
        return status?.name ?? status?.key;
      },
    },
    // {
    //     header: "Actions",
    //     cell: (data) => {
    //         return <Button variant="ghost" size="iconS6" onClick={() => openEditTransitionDialog(data.row.original)}><Edit2Icon/></Button>
    //     }
    // }
  ];

  return (
    <>
      <CrudDataTable
        ref={tableRef}
        className="mt-4"
        title="Transitions"
        createButton={{
          enabled: true,
          onClick: openCreateTransitionDialog,
        }}
        hideRefresh={true}
        columns={columns}
        getRowId={(x) => x.id!}
        fetcher={() => getTransitionsRef.current()}
        disablePagination={true}
        onRowClick={(row) =>
          router.push(
            `/twinclass/${twinClass!.id!}/twinflow/${twinflow.id}/transition/${row.id}`
          )
        }
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
  );
}
