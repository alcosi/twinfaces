"use client";

import { Featurer } from "@/entities/featurer";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";
import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";

interface IProps {
  fetcher: (pagination: PaginationState, options: {}) => Promise<any>;
}

const colDefs: Record<"id" | "name", ColumnDef<Featurer>> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
  },
};

export function FieldTyperTable({ fetcher }: IProps) {
  return (
    <CrudDataTable
      columns={[colDefs.id, colDefs.name]}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[colDefs.id, colDefs.name]}
      fetcher={fetcher}
    />
  );
}
