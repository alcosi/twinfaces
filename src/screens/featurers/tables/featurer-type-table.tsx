"use client";

import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";
import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";

type Props = {
  title: string;
  fetcher: (
    pagination: PaginationState,
    options: FiltersState<string>
  ) => Promise<any>;
};

const colDefs: Record<
  "id" | "name" | "description" | "deprecated",
  ColumnDef<any>
> = {
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
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
  deprecated: {
    id: "deprecated",
    accessorKey: "deprecated",
    header: "Deprecated",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function FeaturerTypeTable({ title, fetcher }: Props) {
  return (
    <CrudDataTable
      title={title}
      columns={[
        colDefs.id,
        colDefs.name,
        colDefs.description,
        colDefs.deprecated,
      ]}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.name,
        colDefs.description,
        colDefs.deprecated,
      ]}
      fetcher={fetcher}
    />
  );
}
