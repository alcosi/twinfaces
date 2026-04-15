import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { toast } from "sonner";

import {
  FactoryTrigger_DETAILED,
  useFactoryTriggerFilters,
  useFactoryTriggerSearch,
} from "@/entities/factory-trigger";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryResourceLink } from "@/features/factory/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinTriggerResourceLink } from "@/features/twin-trigger/ui";
import { PagedResponse } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";

const colDefs: Record<
  | "id"
  | "factory"
  | "inputTwinClass"
  | "factoryConditionSet"
  | "twinFactoryConditionInvert"
  | "active"
  | "description"
  | "twinTrigger"
  | "async",
  ColumnDef<FactoryTrigger_DETAILED>
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
        <div className="inline-flex max-w-48">
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
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink
            data={original.inputTwinClass as TwinClass_DETAILED}
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
  twinFactoryConditionInvert: {
    id: "twinFactoryConditionInvert",
    accessorKey: "twinFactoryConditionInvert",
    header: "Twin factory condition invert",
    cell: (data) => data.getValue() && <Check />,
  },
  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => data.getValue() && <Check />,
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
  twinTrigger: {
    id: "twinTrigger",
    accessorKey: "twinTrigger",
    header: "Twin trigger",
    cell: ({ row: { original } }) =>
      original.twinTrigger && (
        <div className="inline-flex max-w-48">
          <TwinTriggerResourceLink data={original.twinTrigger} withTooltip />
        </div>
      ),
  },
  async: {
    id: "async",
    accessorKey: "async",
    header: "Async",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function FactoryTriggersTable() {
  const { searchFactoryTrigger } = useFactoryTriggerSearch();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryTriggerFilters({
    enabledFilters: undefined,
  });
  async function fetchFactoryTriggers(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<FactoryTrigger_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);
    try {
      return await searchFactoryTrigger({
        pagination,
        filters: _filters,
      });
    } catch (error) {
      toast.error("An error occured while fetching factory triggers:" + error);
      throw new Error(
        "An error occured while fetching factory triggers: " + error
      );
    }
  }
  return (
    <CrudDataTable
      title="Factory triggers"
      columns={[
        colDefs.id,
        colDefs.factory,
        colDefs.inputTwinClass,
        colDefs.factoryConditionSet,
        colDefs.twinFactoryConditionInvert,
        colDefs.active,
        colDefs.description,
        colDefs.twinTrigger,
        colDefs.async,
      ]}
      fetcher={fetchFactoryTriggers}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.factory,
        colDefs.inputTwinClass,
        colDefs.factoryConditionSet,
        colDefs.twinFactoryConditionInvert,
        colDefs.active,
        colDefs.description,
        colDefs.twinTrigger,
        colDefs.async,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
      getRowId={(row) => row.id!}
    />
  );
}
