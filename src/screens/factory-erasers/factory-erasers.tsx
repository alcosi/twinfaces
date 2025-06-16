"use client";

import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { toast } from "sonner";

import {
  FactoryEraser_DETAILED,
  useFactoryEraserFilters,
  useFactoryEraserSearch,
} from "@/entities/factory-eraser";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryResourceLink } from "@/features/factory/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { PagedResponse } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

const colDefs: Record<
  keyof Pick<
    FactoryEraser_DETAILED,
    | "id"
    | "factoryId"
    | "inputTwinClassId"
    | "factoryConditionSetId"
    | "factoryConditionSetInvert"
    | "active"
    | "action"
    | "description"
  >,
  ColumnDef<FactoryEraser_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  factoryId: {
    id: "factoryId",
    accessorKey: "factoryId",
    header: "Factory",
    cell: ({ row: { original } }) =>
      original.factory && (
        <div className="inline-flex max-w-48">
          <FactoryResourceLink data={original.factory} withTooltip />
        </div>
      ),
  },

  inputTwinClassId: {
    id: "inputTwinClassId",
    accessorKey: "inputTwinClassId",
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

  factoryConditionSetId: {
    id: "factoryConditionSetId",
    accessorKey: "factoryConditionSetId",
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

  action: {
    id: "action",
    accessorKey: "action",
    header: "Erase action",
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
};

export function FactoryErasers() {
  const { searchFactoryErasers } = useFactoryEraserSearch();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryEraserFilters();

  async function fetchErasers(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<FactoryEraser_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchFactoryErasers({
        pagination,
        filters: _filters,
      });
    } catch (error) {
      toast.error("An error occurred while fetching factory erasers: " + error);
      throw error;
    }
  }

  return (
    <CrudDataTable
      title="Erasers"
      className="mx-auto mb-10 flex-col p-8 lg:flex lg:justify-center"
      columns={[
        colDefs.id,
        colDefs.factoryId,
        colDefs.inputTwinClassId,
        colDefs.factoryConditionSetId,
        colDefs.factoryConditionSetInvert,
        colDefs.active,
        colDefs.action,
        colDefs.description,
      ]}
      fetcher={fetchErasers}
      getRowId={(row) => row.id!}
      pageSizes={[10, 20, 50]}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.factoryId,
        colDefs.inputTwinClassId,
        colDefs.factoryConditionSetId,
        colDefs.factoryConditionSetInvert,
        colDefs.active,
        colDefs.action,
        colDefs.description,
      ]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
    />
  );
}
