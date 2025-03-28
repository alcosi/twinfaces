"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { FactoryResourceLink } from "@/entities/factory";
import { FactoryConditionSetResourceLink } from "@/entities/factory-condition-set";
import {
  FactoryMultiplierResourceLink,
  FactoryMultiplier_DETAILED,
} from "@/entities/factory-multiplier";
import {
  FactoryMultiplierFilter_DETAILED,
  useFactoryMultiplierFilterFilters,
  useFactoryMultiplierFilterSearch,
} from "@/entities/factory-multiplier-filter";
import {
  TwinClassResourceLink,
  TwinClass_DETAILED,
} from "@/entities/twin-class";
import { useBreadcrumbs } from "@/features/breadcrumb";
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
  },
  inputTwinClass: {
    id: "inputTwinClass",
    accessorKey: "inputTwinClass",
    header: "Input class",
    cell: ({ row: { original } }) =>
      original.inputTwinClass && (
        <div className="max-w-48 inline-flex">
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
      original.factory && (
        <div className="max-w-48 inline-flex">
          <FactoryResourceLink data={original.factory} withTooltip />
        </div>
      ),
  },
  multiplier: {
    id: "multiplier",
    accessorKey: "multiplier",
    header: "Multiplier",
    cell: ({ row: { original } }) =>
      original.multiplier && (
        <div className="max-w-48 inline-flex">
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
        <div className="max-w-48 inline-flex">
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
