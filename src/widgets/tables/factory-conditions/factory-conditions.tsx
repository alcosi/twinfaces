"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check, Copy, EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  FACTORY_CONDITION_SCHEMA,
  FactoryConditionFilterKeys,
  FactoryConditionFilters,
  FactoryCondition_DETAILED,
  useFactoryConditionCount,
  useFactoryConditionCreate,
  useFactoryConditionFilters,
  useFactoryConditionSearch,
} from "@/entities/factory-condition";
import { FactoryConditionSet_DETAILED } from "@/entities/factory-condition-set";
import { Featurer_DETAILED } from "@/entities/featurer";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
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
  FactoryConditionDuplicateDialog,
  FactoryConditionDuplicateDialogRef,
} from "./factory-condition-duplicate-dialog";
import { FactoryConditionFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    FactoryCondition_DETAILED,
    | "id"
    | "factoryConditionSet"
    | "conditionerFeaturer"
    | "description"
    | "active"
    | "invert"
  >,
  ColumnDef<FactoryCondition_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: () => (
      <SortableHeader
        title="Condition Set"
        sortField="factoryConditionSetName"
      />
    ),
    cell: ({ row: { original } }) =>
      original.factoryConditionSet && (
        <div className="inline-flex max-w-48">
          <FactoryConditionSetResourceLink
            data={original.factoryConditionSet as FactoryConditionSet_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  conditionerFeaturer: {
    id: "conditionerFeaturer",
    accessorKey: "conditionerFeaturer",
    header: () => (
      <SortableHeader
        title="Conditioner Featurer"
        sortField="conditionerFeaturerName"
      />
    ),
    cell: ({ row: { original } }) =>
      original.conditionerFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.conditionerFeaturer as Featurer_DETAILED}
            params={original.conditionerDetailedParams}
            withTooltip
          />
        </div>
      ),
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
  active: {
    id: "active",
    accessorKey: "active",
    header: () => <SortableHeader title="Active" sortField="active" />,
    cell: (data) => data.getValue() && <Check />,
  },
  invert: {
    id: "invert",
    accessorKey: "invert",
    header: () => <SortableHeader title="Invert" sortField="invert" />,
    cell: (data) => data.getValue() && <Check />,
  },
};

export function FactoryConditionsTable({
  factoryConditionSetId,
  title,
}: {
  factoryConditionSetId?: string;
  title?: string;
}) {
  const router = useRouter();
  const duplicateDialogRef = useRef<FactoryConditionDuplicateDialogRef>(null);
  const { searchFactoryCondition } = useFactoryConditionSearch();
  const { countFactoryConditions } = useFactoryConditionCount();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryConditionFilters(
    {
      enabledFilters: isTruthy(factoryConditionSetId)
        ? [
            "idList",
            "conditionerFeaturerIdList",
            "descriptionLikeList",
            "active",
            "invert",
          ]
        : undefined,
    }
  );
  const { createFactoryCondition } = useFactoryConditionCreate();

  const showConditionSetColumn = isFalsy(factoryConditionSetId);

  // Maps the table filter values to the API payload and injects the
  // contextual condition-set constraint. Shared by the table fetcher and the
  // pie-chart count requests so both honour the active filters.
  const resolveFilters = useCallback(
    (
      rawFilters: Record<FactoryConditionFilterKeys, unknown>
    ): FactoryConditionFilters => {
      const mapped = mapFiltersToPayload(rawFilters);
      return {
        ...mapped,
        factoryConditionSetIdList: factoryConditionSetId
          ? toArrayOfString(toArray(factoryConditionSetId), "id")
          : mapped.factoryConditionSetIdList,
      };
    },
    [mapFiltersToPayload, factoryConditionSetId]
  );

  const factoryConditionForm = useForm<
    z.infer<typeof FACTORY_CONDITION_SCHEMA>
  >({
    resolver: zodResolver(FACTORY_CONDITION_SCHEMA),
    defaultValues: {
      factoryConditionSetId: factoryConditionSetId || "",
      active: true,
      invert: false,
      description: undefined,
    },
  });

  const actionsCol: ColumnDef<FactoryCondition_DETAILED> = {
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

  async function fetchFactoryConditions(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<FactoryCondition_DETAILED>> {
    try {
      return await searchFactoryCondition({
        pagination,
        filters: resolveFilters(
          filters.filters as Record<FactoryConditionFilterKeys, unknown>
        ),
        sort,
      });
    } catch (error) {
      toast.error(
        "An error occured while fetching factory conditions: " + error
      );
      throw new Error("An error occured while factory conditions: " + error);
    }
  }

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/factory_condition/count/v1), bound to the active filters.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = resolveFilters(
        filters as Record<FactoryConditionFilterKeys, unknown>
      );
      const groupings: ChartGrouping[] = [];

      if (showConditionSetColumn) {
        groupings.push({
          key: "factoryConditionSet",
          label: "Condition Set",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countFactoryConditions({
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
                  data={g.factoryConditionSet as FactoryConditionSet_DETAILED}
                  withTooltip
                />
              )
          ),
        });
      }

      groupings.push({
        key: "conditionerFeaturer",
        label: "Conditioner Featurer",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countFactoryConditions({
              filters: resolved,
              groupField: "conditionerFeaturerId",
              offset,
              limit,
            }),
          (g) =>
            g.conditionerFeaturerId === undefined
              ? undefined
              : String(g.conditionerFeaturerId),
          (g) => g.conditionerFeaturer?.name,
          (g) =>
            g.conditionerFeaturer && (
              <FeaturerResourceLink
                data={g.conditionerFeaturer as Featurer_DETAILED}
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
            countFactoryConditions({
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

      groupings.push({
        key: "invert",
        label: "Invert",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countFactoryConditions({
              filters: resolved,
              groupField: "invert",
              offset,
              limit,
            }),
          (g) => (g.invert === undefined ? undefined : String(g.invert)),
          (g) =>
            g.invert === undefined
              ? undefined
              : g.invert
                ? "Inverted"
                : "Not inverted"
        ),
      });

      return groupings;
    },
    [resolveFilters, countFactoryConditions, showConditionSetColumn]
  );

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof FACTORY_CONDITION_SCHEMA>
  ) => {
    await createFactoryCondition({
      body: {
        conditions: [formValues],
      },
    });
    toast.success("Factory condition created successfully!");
  };

  return (
    <>
      <CrudDataTable
        permissionSegment="conditions"
        columns={[
          colDefs.id,
          ...(showConditionSetColumn ? [colDefs.factoryConditionSet] : []),
          colDefs.conditionerFeaturer,
          colDefs.description,
          colDefs.active,
          colDefs.invert,
          actionsCol,
        ]}
        fetcher={fetchFactoryConditions}
        getRowId={(row) => row.id}
        onRowClick={(row) =>
          router.push(`/${PlatformArea.core}/conditions/${row.id}`)
        }
        defaultVisibleColumns={[
          colDefs.id,
          ...(showConditionSetColumn ? [colDefs.factoryConditionSet] : []),
          colDefs.conditionerFeaturer,
          colDefs.description,
          colDefs.active,
          colDefs.invert,
          actionsCol,
        ]}
        filters={{ filtersInfo: buildFilterFields() }}
        chartGroupings={buildChartGroupings}
        dialogForm={factoryConditionForm}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <FactoryConditionFormFields
            control={factoryConditionForm.control}
            factoryConditionSetId={factoryConditionSetId}
          />
        )}
        title={title}
      />

      <FactoryConditionDuplicateDialog ref={duplicateDialogRef} />
    </>
  );
}
