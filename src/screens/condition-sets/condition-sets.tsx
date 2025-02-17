"use client";

import {
  FactoryConditionSet,
  useFactoryConditionSetSearch,
} from "@/entities/factory-condition-set";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

const colDefs: Record<
  | "id"
  | "name"
  | "description"
  | "inFactoryPipelineUsagesCount"
  | "inFactoryPipelineStepUsagesCount"
  | "inFactoryMultiplierFilterUsagesCount"
  | "inFactoryBranchUsagesCount"
  | "inFactoryEraserUsagesCount",
  ColumnDef<FactoryConditionSet>
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
  inFactoryPipelineUsagesCount: {
    id: "inFactoryPipelineUsagesCount",
    accessorKey: "inFactoryPipelineUsagesCount",
    header: "In pipelines usages count",
  },
  inFactoryPipelineStepUsagesCount: {
    id: "inFactoryPipelineStepUsagesCount",
    accessorKey: "inFactoryPipelineStepUsagesCount",
    header: "In steps usages count",
  },
  inFactoryMultiplierFilterUsagesCount: {
    id: "inFactoryMultiplierFilterUsagesCount",
    accessorKey: "inFactoryMultiplierFilterUsagesCount",
    header: "In multiplier filters usages count",
  },
  inFactoryBranchUsagesCount: {
    id: "inFactoryBranchUsagesCount",
    accessorKey: "inFactoryBranchUsagesCount",
    header: "In branches usages count",
  },
  inFactoryEraserUsagesCount: {
    id: "inFactoryEraserUsagesCount",
    accessorKey: "inFactoryEraserUsagesCount",
    header: "In erasers usages count",
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
      columns={[
        colDefs.id,
        colDefs.name,
        colDefs.description,
        colDefs.inFactoryPipelineUsagesCount,
        colDefs.inFactoryPipelineStepUsagesCount,
        colDefs.inFactoryMultiplierFilterUsagesCount,
        colDefs.inFactoryBranchUsagesCount,
        colDefs.inFactoryEraserUsagesCount,
      ]}
      fetcher={fetchFactoryConditionSet}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.name,
        colDefs.description,
        colDefs.inFactoryPipelineUsagesCount,
        colDefs.inFactoryPipelineStepUsagesCount,
        colDefs.inFactoryMultiplierFilterUsagesCount,
        colDefs.inFactoryBranchUsagesCount,
        colDefs.inFactoryEraserUsagesCount,
      ]}
    />
  );
}
