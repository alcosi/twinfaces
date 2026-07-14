"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check, Copy, EllipsisVertical, FolderUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  FACTORY_MULTIPLIER_SCHEMA,
  FactoryMultiplierFilterKeys,
  FactoryMultiplier_DETAILED,
  useFactoryMultiplierCount,
  useFactoryMultiplierCreate,
  useFactoryMultiplierFilters,
  useFactoryMultipliersSearch,
} from "@/entities/factory-multiplier";
import { Featurer_DETAILED } from "@/entities/featurer";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { FactoryResourceLink } from "@/features/factory/ui";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isFalsy, isTruthy, toArray, toArrayOfString } from "@/shared/libs";
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
  FactoryMultiplierDuplicateDialog,
  FactoryMultiplierDuplicateDialogRef,
} from "./factory-multiplier-duplicate-dialog";
import {
  FactoryMultiplierExportSqlDialog,
  FactoryMultiplierExportSqlDialogRef,
} from "./factory-multiplier-export-sql-dialog";
import { FactoryMultiplierFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    FactoryMultiplier_DETAILED,
    | "id"
    | "factory"
    | "inputTwinClass"
    | "active"
    | "factoryMultiplierFiltersCount"
    | "description"
    | "multiplierFeaturer"
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
    header: () => <SortableHeader title="Factory" sortField="factoryName" />,
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
  multiplierFeaturer: {
    id: "multiplierFeaturer",
    accessorKey: "multiplierFeaturer",
    header: () => (
      <SortableHeader
        title="Muliplier featurer"
        sortField="multiplierFeaturerName"
      />
    ),
    cell: ({ row: { original } }) =>
      original.multiplierFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.multiplierFeaturer as Featurer_DETAILED}
            params={original.multiplierDetailedParams}
            withTooltip
          />
        </div>
      ),
  },
  active: {
    id: "active",
    accessorKey: "active",
    header: () => <SortableHeader title="Active" sortField="active" />,
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

export function FactoryMultipliersTable({
  factoryId,
  title,
}: {
  factoryId?: string;
  title?: string;
}) {
  const router = useRouter();
  const { searchFactoryMultipliers } = useFactoryMultipliersSearch();
  const { countFactoryMultipliers } = useFactoryMultiplierCount();
  const { buildFilterFields, mapFiltersToPayload } =
    useFactoryMultiplierFilters({
      enabledFilters: isTruthy(factoryId)
        ? [
            "idList",
            "inputTwinClassIdList",
            "multiplierFeaturerIdList",
            "active",
            "descriptionLikeList",
          ]
        : undefined,
    });
  const { createFactoryMultiplier } = useFactoryMultiplierCreate();
  const duplicateDialogRef = useRef<FactoryMultiplierDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<FactoryMultiplierExportSqlDialogRef>(null);

  const actionsCol: ColumnDef<FactoryMultiplier_DETAILED> = {
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
                  original as FactoryMultiplier_DETAILED
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
                  original as FactoryMultiplier_DETAILED
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

  const factoryMultiplierForm = useForm<
    z.infer<typeof FACTORY_MULTIPLIER_SCHEMA>
  >({
    resolver: zodResolver(FACTORY_MULTIPLIER_SCHEMA),
    defaultValues: {
      factoryId: factoryId || "",
      inputTwinClassId: "",
      active: true,
      description: undefined,
    },
  });

  // Maps the table filter values to the API payload and injects the
  // contextual factory constraint. Shared by the table fetcher and the
  // pie-chart count requests so both honour the active filters.
  const resolveFilters = useCallback(
    (rawFilters: Record<FactoryMultiplierFilterKeys, unknown>) => {
      const mapped = mapFiltersToPayload(rawFilters);
      return {
        ...mapped,
        factoryIdList: factoryId
          ? toArrayOfString(toArray(factoryId), "id")
          : mapped.factoryIdList,
      };
    },
    [mapFiltersToPayload, factoryId]
  );

  async function fetchFactoryMultipliers(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ) {
    try {
      return await searchFactoryMultipliers({
        pagination,
        filters: resolveFilters(
          filters.filters as Record<FactoryMultiplierFilterKeys, unknown>
        ),
        sort,
      });
    } catch (error) {
      toast.error(
        "An error occured while fetching factory multipliers: " + error
      );
      throw new Error("An error occured while factory multipliers: " + error);
    }
  }

  const showFactoryColumn = isFalsy(factoryId);

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/factory_multiplier/count/v1), bound to the active filters.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = resolveFilters(
        filters as Record<FactoryMultiplierFilterKeys, unknown>
      );
      const groupings: ChartGrouping[] = [];

      if (showFactoryColumn) {
        groupings.push({
          key: "factory",
          label: "Factory",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countFactoryMultipliers({
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
        });
      }

      groupings.push({
        key: "inputTwinClass",
        label: "Input class",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countFactoryMultipliers({
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
        key: "multiplierFeaturer",
        label: "Muliplier featurer",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countFactoryMultipliers({
              filters: resolved,
              groupField: "multiplierFeaturerId",
              offset,
              limit,
            }),
          (g) => g.multiplierFeaturerId?.toString(),
          (g) => g.multiplierFeaturer?.name,
          (g) =>
            g.multiplierFeaturer && (
              <FeaturerResourceLink
                data={g.multiplierFeaturer as Featurer_DETAILED}
                withTooltip
              />
            )
        ),
      });

      groupings.push({
        key: "active",
        label: "Active",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countFactoryMultipliers({
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
    [resolveFilters, countFactoryMultipliers, showFactoryColumn]
  );

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof FACTORY_MULTIPLIER_SCHEMA>
  ) => {
    const { factoryId, ...body } = formValues;

    await createFactoryMultiplier({
      id: factoryId,
      body: { factoryMultiplier: body },
    });
    toast.success("Factory multiplier created successfully!");
  };

  return (
    <>
      <CrudDataTable
        permissionSegment="multipliers"
        columns={[
          colDefs.id,
          ...(showFactoryColumn ? [colDefs.factory] : []),
          colDefs.inputTwinClass,
          colDefs.multiplierFeaturer,
          colDefs.active,
          colDefs.factoryMultiplierFiltersCount,
          colDefs.description,
          actionsCol,
        ]}
        fetcher={fetchFactoryMultipliers}
        getRowId={(row) => row.id}
        onRowClick={(row) =>
          router.push(`/${PlatformArea.core}/multipliers/${row.id}`)
        }
        defaultVisibleColumns={[
          colDefs.id,
          ...(showFactoryColumn ? [colDefs.factory] : []),
          colDefs.inputTwinClass,
          colDefs.multiplierFeaturer,
          colDefs.active,
          colDefs.factoryMultiplierFiltersCount,
          colDefs.description,
          actionsCol,
        ]}
        filters={{ filtersInfo: buildFilterFields() }}
        chartGroupings={buildChartGroupings}
        dialogForm={factoryMultiplierForm}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <FactoryMultiplierFormFields
            control={factoryMultiplierForm.control}
          />
        )}
        title={title}
      />

      <FactoryMultiplierDuplicateDialog ref={duplicateDialogRef} />
      <FactoryMultiplierExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
