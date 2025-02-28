"use client";

import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { FactoryResourceLink } from "@/entities/factory";
import { FactoryConditionSetResourceLink } from "@/entities/factory-condition-set";
import {
  FactoryEraser_DETAILED,
  useFactoryEraserFilters,
  useFactoryEraserSearch,
} from "@/entities/factory-eraser";
import {
  TwinClassResourceLink,
  TwinClass_DETAILED,
} from "@/entities/twin-class";
import { useBreadcrumbs } from "@/features/breadcrumb";
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
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        {original.factory && (
          <FactoryResourceLink data={original.factory} withTooltip />
        )}
      </div>
    ),
  },

  inputTwinClassId: {
    id: "inputTwinClassId",
    accessorKey: "inputTwinClassId",
    header: "Input class",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        {original.inputTwinClass && (
          <TwinClassResourceLink
            data={original.inputTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        )}
      </div>
    ),
  },

  factoryConditionSetId: {
    id: "factoryConditionSetId",
    accessorKey: "factoryConditionSetId",
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

  action: {
    id: "action",
    accessorKey: "action",
    header: "Erase action",
  },

  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
};

export function FactoryErasers() {
  const { searchFactoryErasers } = useFactoryEraserSearch();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryEraserFilters();
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Erasers", href: "/workspace/erasers" }]);
  }, []);

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
      className="mb-10 p-8 lg:flex lg:justify-center flex-col mx-auto"
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
      onRowClick={(row) => {
        router.push(`/workspace/erasers/${row.id}`);
      }}
    />
  );
}
