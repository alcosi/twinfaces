"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { FactoryMultiplier_DETAILED } from "@/entities/factory-multiplier";
import {
  FactoryMultiplierFilter_DETAILED,
  useFactoryMultiplierFilterFilters,
  useFactoryMultiplierFilterSearch,
} from "@/entities/factory-multiplier-filter";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryMultiplierResourceLink } from "@/features/factory-multiplier/ui";
import { FactoryResourceLink } from "@/features/factory/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

const colDefs: Record<
  | "id"
  | "description"
  | "inputTwinClass"
  | "factory"
  | "factoryConditionSet"
  | "factoryConditionSetInvert"
  | "active"
  | "multiplier",
  ColumnDef<FactoryMultiplierFilter_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
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
  inputTwinClass: {
    id: "inputTwinClass",
    accessorKey: "inputTwinClass",
    header: "Input class",
    cell: ({ row: { original } }) =>
      original.inputTwinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink
            data={original.inputTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  factory: {
    id: "factory",
    accessorKey: "factory",
    header: "Factory",
    cell: ({ row: { original } }) =>
      original.multiplier.factory && (
        <div className="inline-flex max-w-48">
          <FactoryResourceLink data={original.multiplier.factory} withTooltip />
        </div>
      ),
  },
  multiplier: {
    id: "multiplier",
    accessorKey: "multiplier",
    header: "Multiplier",
    cell: ({ row: { original } }) =>
      original.multiplier && (
        <div className="inline-flex max-w-48">
          <FactoryMultiplierResourceLink
            data={original.multiplier as FactoryMultiplier_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: "Condition set",
    cell: ({ row: { original } }) =>
      original.factoryConditionSet && (
        <div className="inline-flex max-w-48">
          <FactoryConditionSetResourceLink
            data={original.factoryConditionSet}
            withTooltip
          />
        </div>
      ),
  },
  factoryConditionSetInvert: {
    id: "factoryConditionSetInvert",
    accessorKey: "factoryConditionSetInvert",
    header: "Condition invert",
    cell: (data) => data.getValue() && <Check />,
  },
  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function FactoryMultiplierFiltersScreen() {
  const { searchFactoryMultiplierFilters } = useFactoryMultiplierFilterSearch();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { buildFilterFields, mapFiltersToPayload } =
    useFactoryMultiplierFilterFilters();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Multiplier filters",
        href: `/${PlatformArea.core}/multiplier-filters`,
      },
    ]);
  }, [setBreadcrumbs]);

  async function fetchFactoryMultiplierFilter(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<FactoryMultiplierFilter_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchFactoryMultiplierFilters({
        pagination,
        filters: _filters,
      });
    } catch (error) {
      toast.error(
        "An error occured while fetching factory multiplier filters: " + error
      );
      throw new Error(
        "An error occured while fetching factory multiplier filters: " + error
      );
    }
  }

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        colDefs.factory,
        colDefs.multiplier,
        colDefs.inputTwinClass,
        colDefs.factoryConditionSet,
        colDefs.factoryConditionSetInvert,
        colDefs.active,
        colDefs.description,
      ]}
      fetcher={fetchFactoryMultiplierFilter}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.factory,
        colDefs.multiplier,
        colDefs.inputTwinClass,
        colDefs.factoryConditionSet,
        colDefs.factoryConditionSetInvert,
        colDefs.active,
        colDefs.description,
      ]}
      getRowId={(row) => row.id!}
      filters={{ filtersInfo: buildFilterFields() }}
    />
  );
}
