"use client";

import { FactoryResourceLink } from "@/entities/factory";
import {
  FactoryMultiplier_DETAILED,
  useFactoryMultiplierFilters,
  useFactoryMultipliersSearch,
} from "@/entities/factory-multiplier";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twin-class";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const colDefs: Record<
  keyof Pick<
    FactoryMultiplier_DETAILED,
    | "id"
    | "factory"
    | "inputTwinClass"
    | "active"
    | "factoryMultiplierFiltersCount"
    | "description"
  >,
  ColumnDef<FactoryMultiplier_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
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
  //TODO add missing column Multiplier featurer in DTO
  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => data.getValue() && <Check />,
  },
  factoryMultiplierFiltersCount: {
    id: "factoryMultiplierFiltersCount",
    accessorKey: "factoryMultiplierFiltersCount",
    header: "Filters count",
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
};

export function FactoryMultipliersScreen() {
  const { searchFactoryMultipliers } = useFactoryMultipliersSearch();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { buildFilterFields, mapFiltersToPayload } =
    useFactoryMultiplierFilters();

  useEffect(() => {
    setBreadcrumbs([{ label: "Multipliers", href: "/workspace/multipliers" }]);
  }, [setBreadcrumbs]);

  async function fetchFactoryMultipliers(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchFactoryMultipliers({ pagination, filters: _filters });
    } catch (error) {
      toast.error(
        "An error occured while fetching factory multipliers: " + error
      );
      throw new Error("An error occured while factory multipliers: " + error);
    }
  }

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        colDefs.factory,
        colDefs.inputTwinClass,
        //TODO add missing column Multiplier featurer in DTO
        colDefs.active,
        colDefs.factoryMultiplierFiltersCount,
        colDefs.description,
      ]}
      fetcher={fetchFactoryMultipliers}
      getRowId={(row) => row.id}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.factory,
        colDefs.inputTwinClass,
        //TODO add missing column Multiplier featurer in DTO
        colDefs.active,
        colDefs.factoryMultiplierFiltersCount,
        colDefs.description,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
    />
  );
}
