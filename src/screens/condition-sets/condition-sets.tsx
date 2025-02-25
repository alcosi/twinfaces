"use client";

import {
  FactoryConditionSet,
  useFactoryConditionSetFilters,
  useFactoryConditionSetSearch,
} from "@/entities/factory-condition-set";
import { UserResourceLink } from "@/entities/user";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useEffect } from "react";
import { toast } from "sonner";

const colDefs: Record<
  | "id"
  | "name"
  | "description"
  | "inFactoryPipelineUsagesCount"
  | "inFactoryPipelineStepUsagesCount"
  | "inFactoryMultiplierFilterUsagesCount"
  | "inFactoryBranchUsagesCount"
  | "inFactoryEraserUsagesCount"
  | "createdByUserId"
  | "createdAt",
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
  createdByUserId: {
    id: "createdByUserId",
    accessorKey: "createdByUserId",
    header: "Created by",
    cell: ({ row: { original } }) =>
      original.createdByUser && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.createdByUser} withTooltip />
        </div>
      ),
  },
  createdAt: {
    id: "createdBy",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt && formatToTwinfaceDate(original.createdAt),
  },
};

export function ConditionSetsScreen() {
  const { searchFactoryConditionSet } = useFactoryConditionSetSearch();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { buildFilterFields, mapFiltersToPayload } =
    useFactoryConditionSetFilters();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Condition Sets", href: "/workspace/condition-sets" },
    ]);
  }, [setBreadcrumbs]);

  async function fetchFactoryConditionSet(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return searchFactoryConditionSet({ pagination, filters: _filters });
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
        colDefs.createdByUserId,
        colDefs.createdAt,
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
        colDefs.createdByUserId,
        colDefs.createdAt,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
    />
  );
}
