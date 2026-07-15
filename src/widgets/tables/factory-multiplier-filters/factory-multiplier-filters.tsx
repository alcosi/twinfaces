"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check, Copy, EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { toast } from "sonner";

import { FactoryMultiplier_DETAILED } from "@/entities/factory-multiplier";
import {
  FactoryMultiplierFilterFilterKeys,
  FactoryMultiplierFilter_DETAILED,
  useFactoryMultiplierFilterCount,
  useFactoryMultiplierFilterFilters,
  useFactoryMultiplierFilterSearch,
} from "@/entities/factory-multiplier-filter";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryMultiplierResourceLink } from "@/features/factory-multiplier/ui";
import { FactoryResourceLink } from "@/features/factory/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isFalsy, toArray, toArrayOfString } from "@/shared/libs";
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
} from "../../crud-data-table";
import {
  FactoryMultiplierFilterDuplicateDialog,
  FactoryMultiplierFilterDuplicateDialogRef,
} from "./factory-multiplier-filter-duplicate-dialog";

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
  inputTwinClass: {
    id: "inputTwinClass",
    accessorKey: "inputTwinClass",
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
  factory: {
    id: "factory",
    accessorKey: "factory",
    header: "Factory",
    cell: ({ row: { original } }) =>
      original?.multiplier?.factory && (
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
};

export function FactoryMultiplierFiltersTable({
  factoryMultiplierId,
}: {
  factoryMultiplierId?: string;
}) {
  const router = useRouter();
  const duplicateDialogRef =
    useRef<FactoryMultiplierFilterDuplicateDialogRef>(null);
  const { searchFactoryMultiplierFilters } = useFactoryMultiplierFilterSearch();
  const { countFactoryMultiplierFilters } = useFactoryMultiplierFilterCount();
  const { buildFilterFields, mapFiltersToPayload } =
    useFactoryMultiplierFilterFilters({
      enabledFilters: factoryMultiplierId
        ? [
            "idList",
            "factoryIdList",
            "inputTwinClassIdList",
            "factoryConditionSetIdList",
            "active",
            "descriptionLikeList",
            "factoryConditionInvert",
          ]
        : undefined,
    });

  const actionsCol: ColumnDef<FactoryMultiplierFilter_DETAILED> = {
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
                duplicateDialogRef.current?.open(original);
              }}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  };

  const showMultiplierColumn = isFalsy(factoryMultiplierId);

  // Maps the table filter values to the API payload and injects the
  // contextual multiplier constraint. Shared by the table fetcher and the
  // pie-chart count requests so both honour the active filters.
  const resolveFilters = useCallback(
    (rawFilters: Record<FactoryMultiplierFilterFilterKeys, unknown>) => {
      const mapped = mapFiltersToPayload(rawFilters);
      return {
        ...mapped,
        factoryMultiplierIdList: factoryMultiplierId
          ? toArrayOfString(toArray(factoryMultiplierId), "id")
          : mapped.factoryMultiplierIdList,
      };
    },
    [mapFiltersToPayload, factoryMultiplierId]
  );

  async function fetchFactoryMultiplierFilter(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<FactoryMultiplierFilter_DETAILED>> {
    try {
      return await searchFactoryMultiplierFilters({
        pagination,
        filters: resolveFilters(
          filters.filters as Record<FactoryMultiplierFilterFilterKeys, unknown>
        ),
        sort,
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

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/factory_multiplier_filter/count/v1), bound to the active filters.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = resolveFilters(
        filters as Record<FactoryMultiplierFilterFilterKeys, unknown>
      );
      const groupings: ChartGrouping[] = [];

      if (showMultiplierColumn) {
        groupings.push({
          key: "multiplier",
          label: "Multiplier",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countFactoryMultiplierFilters({
                filters: resolved,
                groupField: "factoryMultiplierId",
                offset,
                limit,
              }),
            (g) => g.factoryMultiplierId,
            (g) => g.multiplier?.description,
            (g) =>
              g.multiplier && (
                <FactoryMultiplierResourceLink
                  data={g.multiplier as FactoryMultiplier_DETAILED}
                  withTooltip
                />
              )
          ),
        });
      }

      groupings.push({
        key: "inputTwinClass",
        label: "Input class",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countFactoryMultiplierFilters({
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
      });

      groupings.push({
        key: "factoryConditionSet",
        label: "Condition set",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countFactoryMultiplierFilters({
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
      });

      groupings.push({
        key: "factoryConditionSetInvert",
        label: "Condition invert",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countFactoryMultiplierFilters({
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
      });

      groupings.push({
        key: "active",
        label: "Active",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countFactoryMultiplierFilters({
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
      });

      return groupings;
    },
    [resolveFilters, countFactoryMultiplierFilters, showMultiplierColumn]
  );

  return (
    <>
      <CrudDataTable
        permissionSegment="multiplier-filters"
        columns={[
          colDefs.id,
          colDefs.factory,
          ...(showMultiplierColumn ? [colDefs.multiplier] : []),
          colDefs.inputTwinClass,
          colDefs.factoryConditionSet,
          colDefs.factoryConditionSetInvert,
          colDefs.active,
          colDefs.description,
          actionsCol,
        ]}
        onRowClick={(row) =>
          router.push(`/${PlatformArea.core}/multiplier-filters/${row.id}`)
        }
        fetcher={fetchFactoryMultiplierFilter}
        defaultVisibleColumns={[
          colDefs.id,
          colDefs.factory,
          ...(showMultiplierColumn ? [colDefs.multiplier] : []),
          colDefs.inputTwinClass,
          colDefs.factoryConditionSet,
          colDefs.factoryConditionSetInvert,
          colDefs.active,
          colDefs.description,
          actionsCol,
        ]}
        getRowId={(row) => row.id!}
        filters={{ filtersInfo: buildFilterFields() }}
        chartGroupings={buildChartGroupings}
      />

      <FactoryMultiplierFilterDuplicateDialog ref={duplicateDialogRef} />
    </>
  );
}
