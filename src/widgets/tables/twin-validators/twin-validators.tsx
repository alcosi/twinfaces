"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

import { Featurer_DETAILED } from "@/entities/featurer";
import {
  TwinValidatorFilterKeys,
  TwinValidatorFilters,
  TwinValidator_DETAILED,
  useTwinValidatorCount,
  useTwinValidatorFilters,
  useTwinValidatorSearch,
} from "@/entities/twin-validator";
import { ValidatorSet_DETAILED } from "@/entities/validator-set";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { ValidatorSetResourceLink } from "@/features/validator-set/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import { isFalsy, isTruthy, toArray, toArrayOfString } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  FiltersState,
  SortableHeader,
  buildCountGroupingLoad,
} from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<
    TwinValidator_DETAILED,
    | "id"
    | "twinValidatorSet"
    | "validatorFeaturer"
    | "description"
    | "invert"
    | "active"
    | "order"
  >,
  ColumnDef<TwinValidator_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  twinValidatorSet: {
    id: "twinValidatorSet",
    accessorKey: "twinValidatorSet",
    header: () => (
      <SortableHeader title="Validator set" sortField="twinValidatorSetName" />
    ),
    cell: ({ row: { original } }) =>
      original.twinValidatorSet && (
        <div className="inline-flex max-w-48">
          <ValidatorSetResourceLink
            data={original.twinValidatorSet as ValidatorSet_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  validatorFeaturer: {
    id: "validatorFeaturer",
    accessorKey: "validatorFeaturer",
    header: () => (
      <SortableHeader title="Featurer" sortField="twinValidatorFeaturerName" />
    ),
    cell: ({ row: { original } }) =>
      original.validatorFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.validatorFeaturer as Featurer_DETAILED}
            params={original.validatorDetailedParams}
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
  invert: {
    id: "invert",
    accessorKey: "invert",
    header: () => <SortableHeader title="Invert" sortField="invert" />,
    cell: (data) => data.getValue() && <Check />,
  },
  active: {
    id: "active",
    accessorKey: "active",
    header: () => <SortableHeader title="Active" sortField="active" />,
    cell: (data) => data.getValue() && <Check />,
  },
  order: {
    id: "order",
    accessorKey: "order",
    header: () => <SortableHeader title="Order" sortField="order" />,
  },
};

export function TwinValidatorsTable({
  twinValidatorSetId,
  title,
}: {
  /** Scopes the table to one validator set, hiding its now-constant column. */
  twinValidatorSetId?: string;
  title?: string;
}) {
  const { searchTwinValidators } = useTwinValidatorSearch();
  const { countTwinValidators } = useTwinValidatorCount();
  const { buildFilterFields, mapFiltersToPayload } = useTwinValidatorFilters({
    enabledFilters: isTruthy(twinValidatorSetId)
      ? [
          "idList",
          "validatorFeaturerIdList",
          "descriptionLikeList",
          "invert",
          "active",
        ]
      : undefined,
  });

  const showValidatorSetColumn = isFalsy(twinValidatorSetId);

  // Maps the table filter values to the API payload and injects the contextual
  // validator-set constraint. Shared by the table fetcher and the pie-chart
  // count requests so both honour the active filters.
  const resolveFilters = useCallback(
    (
      rawFilters: Record<TwinValidatorFilterKeys, unknown>
    ): TwinValidatorFilters => {
      const mapped = mapFiltersToPayload(rawFilters);

      return {
        ...mapped,
        twinValidatorSetIdList: twinValidatorSetId
          ? toArrayOfString(toArray(twinValidatorSetId), "id")
          : mapped.twinValidatorSetIdList,
      };
    },
    [mapFiltersToPayload, twinValidatorSetId]
  );

  async function fetchTwinValidators(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<TwinValidator_DETAILED>> {
    try {
      return await searchTwinValidators({
        pagination,
        filters: resolveFilters(
          filters.filters as Record<TwinValidatorFilterKeys, unknown>
        ),
        sort,
      });
    } catch (error) {
      toast.error("An error occured while fetching validators: " + error);
      throw new Error("An error occured while fetching validators: " + error);
    }
  }

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/twin_validator/count/v1), bound to the active filters.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = resolveFilters(
        filters as Record<TwinValidatorFilterKeys, unknown>
      );
      const groupings: ChartGrouping[] = [];

      if (showValidatorSetColumn) {
        groupings.push({
          key: "twinValidatorSet",
          label: "Validator set",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinValidators({
                filters: resolved,
                groupField: "twinValidatorSetId",
                offset,
                limit,
              }),
            (g) => g.twinValidatorSetId,
            (g) => g.twinValidatorSet?.name,
            (g) =>
              g.twinValidatorSet && (
                <ValidatorSetResourceLink
                  data={g.twinValidatorSet as ValidatorSet_DETAILED}
                  withTooltip
                />
              )
          ),
        });
      }

      groupings.push({
        key: "validatorFeaturer",
        label: "Featurer",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countTwinValidators({
              filters: resolved,
              groupField: "validatorFeaturerId",
              offset,
              limit,
            }),
          (g) =>
            g.validatorFeaturerId === undefined
              ? undefined
              : String(g.validatorFeaturerId),
          (g) => g.validatorFeaturer?.name,
          (g) =>
            g.validatorFeaturer && (
              <FeaturerResourceLink
                data={g.validatorFeaturer as Featurer_DETAILED}
                withTooltip
              />
            )
        ),
      });

      groupings.push({
        key: "invert",
        label: "Invert",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countTwinValidators({
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

      groupings.push({
        key: "active",
        label: "Active",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countTwinValidators({
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
    [resolveFilters, countTwinValidators, showValidatorSetColumn]
  );

  const columns = [
    colDefs.id,
    ...(showValidatorSetColumn ? [colDefs.twinValidatorSet] : []),
    colDefs.validatorFeaturer,
    colDefs.description,
    colDefs.invert,
    colDefs.active,
    colDefs.order,
  ];

  return (
    <CrudDataTable
      permissionSegment="validators"
      columns={columns}
      defaultVisibleColumns={columns}
      getRowId={(row) => row.id}
      fetcher={fetchTwinValidators}
      filters={{ filtersInfo: buildFilterFields() }}
      chartGroupings={buildChartGroupings}
      // A validator has no page of its own, so a row is not a link.
      disableRowClick
      title={title}
    />
  );
}
