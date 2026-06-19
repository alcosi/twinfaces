"use client";

import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check, EllipsisVertical, FolderUp } from "lucide-react";
import { useRef } from "react";
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
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  GuidWithCopy,
} from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

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
      />

      <FactoryEraserExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
