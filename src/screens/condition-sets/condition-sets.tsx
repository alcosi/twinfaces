"use client";

import {
  FactoryConditionSet,
  useFactoryConditionSetSearch,
} from "@/entities/factory-condition-set";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

const colDefs: Record<"id" | "name", ColumnDef<FactoryConditionSet>> = {
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

export function ConditionSetsScreen() {
  const { searchFactoryConditionSet } = useFactoryConditionSetSearch();

  async function fetchFactoryConditionSet(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    try {
      return searchFactoryConditionSet({ pagination, filters: {} });
    } catch (error) {
      toast.error(
        "An error occured while fetching factory condition sets: " + error
      );
      throw new Error(
        "An error occured while fetching factory condition sets: " + error
      );
    }
  }

  return (
    <CrudDataTable
      columns={[colDefs.id, colDefs.name]}
      fetcher={fetchFactoryConditionSet}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[colDefs.id, colDefs.name]}
    />
  );
}
