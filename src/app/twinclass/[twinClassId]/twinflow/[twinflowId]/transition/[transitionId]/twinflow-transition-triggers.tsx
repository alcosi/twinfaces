import {
  TwinFlowTransition,
  TwinFlowTransitionTrigger,
} from "@/lib/api/api-types";
import { CrudDataTable } from "@/components/base/data-table/crud-data-table";
import { useRef, useState } from "react";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { ColumnDef } from "@tanstack/table-core";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { TwinflowTransitionTriggerDialog } from "./twinflow-transition-trigger-dialog";

export function TwinflowTransitionTriggers({
  transition,
  onChange,
}: {
  transition: TwinFlowTransition;
  onChange: () => any;
}) {
  const tableRef = useRef<DataTableHandle>(null);

  const [createEditTriggerDialogOpen, setCreateEditTriggerDialogOpen] =
    useState<boolean>(false);
  const [editedTrigger, setEditedTrigger] =
    useState<TwinFlowTransitionTrigger | null>(null);

  const getTriggersRef = useRef(getTriggers);

  function openCreateTriggerDialog() {
    setEditedTrigger(null);
    setCreateEditTriggerDialogOpen(true);
  }

  function editTriggerDialog(trigger: TwinFlowTransitionTrigger) {
    setEditedTrigger(trigger);
    setCreateEditTriggerDialogOpen(true);
  }

  function onCreateEditSuccess() {
    onChange?.();
    tableRef.current?.refresh();
    setCreateEditTriggerDialogOpen(false);
  }

  function getTriggers() {
    return Promise.resolve({
      data: Object.values(transition.triggers ?? {}),
      pageCount: 0,
    });
  }

  const columns: ColumnDef<TwinFlowTransitionTrigger>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
    },
    {
      accessorKey: "order",
      header: "Order",
    },
    {
      accessorKey: "active",
      header: "Active",
    },
    {
      accessorKey: "featurer",
      header: "Featurer",
    },
  ];

  return (
    <>
      <CrudDataTable
        ref={tableRef}
        className="mt-4"
        title="Transitions"
        createButton={{
          enabled: true,
          onClick: openCreateTriggerDialog,
        }}
        hideRefresh={true}
        columns={columns}
        getRowId={(x) => x.id!}
        fetcher={() => getTriggersRef.current()}
        disablePagination={true}
        onRowClick={(row) => editTriggerDialog(row)}
      />

      <TwinflowTransitionTriggerDialog
        open={createEditTriggerDialogOpen}
        onOpenChange={setCreateEditTriggerDialogOpen}
        transitionId={transition.id!}
        trigger={editedTrigger}
        onSuccess={onCreateEditSuccess}
      />
    </>
  );
}
