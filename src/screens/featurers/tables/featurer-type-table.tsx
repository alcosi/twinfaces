"use client";

import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";

import { Featurer } from "@/entities/featurer";
import { PagedResponse } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

type Props = {
  title: string;
  fetcher: (
    pagination: PaginationState,
    options: FiltersState
  ) => Promise<PagedResponse<Featurer>>;
};

const colDefs: Record<
  "id" | "name" | "description" | "deprecated",
  ColumnDef<Featurer>
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
    cell: ({ row: { original } }) =>
      original.description && (
        <div className="text-muted-foreground line-clamp-2 max-w-64">
          {original.description}
        </div>
      ),
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
      getRowId={(row) => row.id!.toString()}
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
