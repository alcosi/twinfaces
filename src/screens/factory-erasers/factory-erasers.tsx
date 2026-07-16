"use client";

import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check, Copy, EllipsisVertical, FolderUp } from "lucide-react";
import { useCallback, useRef } from "react";
import { toast } from "sonner";

import {
  FactoryEraserFilterKeys,
  FactoryEraser_DETAILED,
  useFactoryEraserCount,
  useFactoryEraserFilters,
  useFactoryEraserSearch,
} from "@/entities/factory-eraser";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryResourceLink } from "@/features/factory/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  GuidWithCopy,
} from "@/shared/ui";
import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  FiltersState,
  SortableHeader,
  buildCountGroupingLoad,
} from "@/widgets/crud-data-table";

import {
  FactoryEraserDuplicateDialog,
  FactoryEraserDuplicateDialogRef,
} from "./factory-eraser-duplicate-dialog";
import {
  FactoryEraserExportSqlDialog,
  FactoryEraserExportSqlDialogRef,
} from "./factory-erasers-export-sql-dialog";

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
    header: () => <SortableHeader title="Factory" sortField="factoryName" />,
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
    header: () => (
      <SortableHeader title="Input class" sortField="inputTwinClassName" />
    ),
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
    header: () => (
      <SortableHeader
        title="Condition set"
        sortField="factoryConditionSetName"
      />
    ),
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
    header: () => (
      <SortableHeader
        title="Condition invert"
        sortField="factoryConditionSetInvert"
      />
    ),
    cell: (data) => data.getValue() && <Check />,
  },

  active: {
    id: "active",
    accessorKey: "active",
    header: () => <SortableHeader title="Active" sortField="active" />,
    cell: (data) => data.getValue() && <Check />,
  },

  action: {
    id: "action",
    accessorKey: "action",
    header: () => <SortableHeader title="Erase action" sortField="action" />,
  },

  description: {
    id: "description",
    accessorKey: "description",
    header: () => (
      <SortableHeader title="Description" sortField="description" />
    ),
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
  const { countFactoryErasers } = useFactoryEraserCount();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryEraserFilters();
  const duplicateDialogRef = useRef<FactoryEraserDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<FactoryEraserExportSqlDialogRef>(null);

  const actionsCol: ColumnDef<FactoryEraser_DETAILED> = {
    id: "actions",
    header: "Actions",
    cell: ({ row: { original } }) => (
      <div
        className="flex justify-end"
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="iconS6"
              onClick={(event) => event.stopPropagation()}
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                duplicateDialogRef.current?.open(
                  original as FactoryEraser_DETAILED
                );
              }}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                exportSqlDialogRef.current?.open(
                  original as FactoryEraser_DETAILED
                );
              }}
              className="cursor-pointer"
            >
              <FolderUp className="mr-2 h-4 w-4" />
              Export sql
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  };

  async function fetchErasers(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<FactoryEraser_DETAILED>> {
    try {
      return await searchFactoryErasers({
        pagination,
        filters: mapFiltersToPayload(
          filters.filters as Record<FactoryEraserFilterKeys, unknown>
        ),
        sort,
      });
    } catch (error) {
      toast.error("An error occurred while fetching factory erasers: " + error);
      throw error;
    }
  }

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/factory_eraser/count/v1), bound to the active filters.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = mapFiltersToPayload(
        filters as Record<FactoryEraserFilterKeys, unknown>
      );

      return [
        {
          key: "factory",
          label: "Factory",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countFactoryErasers({
                filters: resolved,
                groupField: "factoryId",
                offset,
                limit,
              }),
            (g) => g.factoryId,
            (g) => g.factory?.name ?? g.factory?.key,
            (g) =>
              g.factory && <FactoryResourceLink data={g.factory} withTooltip />
          ),
        },
        {
          key: "inputTwinClass",
          label: "Input class",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countFactoryErasers({
                filters: resolved,
                groupField: "inputTwinClassId",
                offset,
                limit,
              }),
            (g) => g.inputTwinClassId,
            (g) => g.inputTwinClass?.name ?? g.inputTwinClass?.key,
            (g) =>
              g.inputTwinClass && (
                <TwinClassResourceLink
                  data={g.inputTwinClass as TwinClass_DETAILED}
                  withTooltip
                />
              )
          ),
        },
        {
          key: "factoryConditionSet",
          label: "Condition set",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countFactoryErasers({
                filters: resolved,
                groupField: "factoryConditionSetId",
                offset,
                limit,
              }),
            (g) => g.factoryConditionSetId,
            (g) => g.factoryConditionSet?.name,
            (g) =>
              g.factoryConditionSet && (
                <FactoryConditionSetResourceLink
                  data={g.factoryConditionSet}
                  withTooltip
                />
              )
          ),
        },
        {
          key: "action",
          label: "Erase action",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countFactoryErasers({
                filters: resolved,
                groupField: "action",
                offset,
                limit,
              }),
            (g) => g.action,
            (g) => g.action
          ),
        },
        {
          key: "active",
          label: "Active",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countFactoryErasers({
                filters: resolved,
                groupField: "active",
                offset,
                limit,
              }),
            (g) => (g.active === undefined ? undefined : String(g.active)),
            (g) =>
              g.active === undefined
                ? undefined
                : g.active
                  ? "Active"
                  : "Inactive"
          ),
        },
        {
          key: "factoryConditionSetInvert",
          label: "Condition invert",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countFactoryErasers({
                filters: resolved,
                groupField: "factoryConditionSetInvert",
                offset,
                limit,
              }),
            (g) =>
              g.factoryConditionSetInvert === undefined
                ? undefined
                : String(g.factoryConditionSetInvert),
            (g) =>
              g.factoryConditionSetInvert === undefined
                ? undefined
                : g.factoryConditionSetInvert
                  ? "Inverted"
                  : "Not inverted"
          ),
        },
      ];
    },
    [mapFiltersToPayload, countFactoryErasers]
  );

  return (
    <>
      <CrudDataTable
        title="Erasers"
        columns={[
          colDefs.id,
          colDefs.factoryId,
          colDefs.inputTwinClassId,
          colDefs.factoryConditionSetId,
          colDefs.factoryConditionSetInvert,
          colDefs.active,
          colDefs.action,
          colDefs.description,
          actionsCol,
        ]}
        fetcher={fetchErasers}
        getRowId={(row) => row.id!}
        defaultVisibleColumns={[
          colDefs.id,
          colDefs.factoryId,
          colDefs.inputTwinClassId,
          colDefs.factoryConditionSetId,
          colDefs.factoryConditionSetInvert,
          colDefs.active,
          colDefs.action,
          colDefs.description,
          actionsCol,
        ]}
        filters={{
          filtersInfo: buildFilterFields(),
        }}
        chartGroupings={buildChartGroupings}
      />

      <FactoryEraserDuplicateDialog ref={duplicateDialogRef} />
      <FactoryEraserExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
