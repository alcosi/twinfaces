"use client";

import { Featurer_DETAILED } from "@/entities/featurer";
import { PagedResponse } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";
import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";

type Props = {
  title: string;
  fetcher: (
    pagination: PaginationState,
    options: FiltersState
  ) => Promise<PagedResponse<Featurer_DETAILED>>;
};

const colDefs: Record<
  "id" | "name" | "description" | "deprecated",
  ColumnDef<Featurer_DETAILED>
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
      getRowId={(row) => row.id.toString()}
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
