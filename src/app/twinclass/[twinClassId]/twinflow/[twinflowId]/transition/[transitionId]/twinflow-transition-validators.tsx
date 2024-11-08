import {
  TwinFlowTransition,
  TwinFlowTransitionValidator,
} from "@/entities/twinFlow";
import { CrudDataTable } from "@/components/base/data-table/crud-data-table";
import { useRef, useState } from "react";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { ColumnDef } from "@tanstack/table-core";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { TwinflowTransitionValidatorDialog } from "./twinflow-transition-validator-dialog";

export function TwinflowTransitionValidators({
  transition,
  onChange,
}: {
  transition: TwinFlowTransition;
  onChange: () => any;
}) {
  const tableRef = useRef<DataTableHandle>(null);

  const [createEditValidatorDialogOpen, setCreateEditValidatorDialogOpen] =
    useState<boolean>(false);
  const [editedValidator, setEditedValidator] =
    useState<TwinFlowTransitionValidator | null>(null);

  const getValidatorsRef = useRef(getValidators);

  function openCreateValidatorDialog() {
    setEditedValidator(null);
    setCreateEditValidatorDialogOpen(true);
  }

  function editValidatorDialog(validator: TwinFlowTransitionValidator) {
    setEditedValidator(validator);
    setCreateEditValidatorDialogOpen(true);
  }

  function onCreateEditSuccess() {
    onChange?.();
    tableRef.current?.refresh();
    setCreateEditValidatorDialogOpen(false);
  }

  function getValidators() {
    return Promise.resolve({
      data: Object.values(transition.validatorRules ?? {}),
      pageCount: 0,
    });
  }

  const columns: ColumnDef<TwinFlowTransitionValidator>[] = [
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
    {
      accessorKey: "invert",
      header: "Invert",
    },
  ];

  return (
    <>
      <CrudDataTable
        ref={tableRef}
        className="mt-4"
        title="Validators"
        createButton={{
          enabled: true,
          onClick: openCreateValidatorDialog,
        }}
        hideRefresh={true}
        columns={columns}
        getRowId={(x) => x.id!}
        fetcher={() => getValidatorsRef.current()}
        disablePagination={true}
        onRowClick={(row) => editValidatorDialog(row)}
      />

      <TwinflowTransitionValidatorDialog
        open={createEditValidatorDialogOpen}
        onOpenChange={setCreateEditValidatorDialogOpen}
        transitionId={transition.id!}
        validator={editedValidator}
        onSuccess={onCreateEditSuccess}
      />
    </>
  );
}
