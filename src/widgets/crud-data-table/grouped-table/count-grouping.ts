import { PaginationState } from "@tanstack/react-table";
import { ReactNode } from "react";

import { PagedResponse, SortV1 } from "@/shared/api";
import { NULLIFY_UUID_VALUE } from "@/shared/libs";

import { ChartGrouping, buildCountGroupingLoad } from "../chart-view";
import { TableGrouping, TableQueryContext } from "./types";

export const NO_VALUE_GROUP_LABEL = "— Not set —";

/**
 * How a search is narrowed down to the rows of one group. `value` is the
 * group's value as {@link CountGroupField.getValue} gives it; `null` is the
 * group of rows with no value, which only some filters can express.
 */
export type GroupNarrowing<TFilters> = {
  apply: (filters: TFilters, value: string | null) => TFilters;
  /** Whether `apply` can reach the group of rows with no value. */
  supportsNoValue: boolean;
};

function withFilter<TFilters>(
  filters: TFilters,
  key: keyof TFilters,
  value: unknown
): TFilters {
  return { ...filters, [key]: value };
}

/**
 * Narrowing builders for the search filter shapes the API uses. The value of
 * a group replaces whatever the filter held: the group was counted under that
 * filter, so it already lies inside it.
 */
export const narrowBy = {
  /** `…IdList: uuid[]`. The empty group is reached with the nullify marker. */
  idList: <TFilters>(key: keyof TFilters): GroupNarrowing<TFilters> => ({
    apply: (filters, value) =>
      withFilter(filters, key, [value ?? NULLIFY_UUID_VALUE]),
    supportsNoValue: true,
  }),
  /**
   * `…IdMap: { [uuid]: boolean }`, where `true` also takes in what the id's
   * class hierarchy inherits. The group's id goes in as `false`: exactly that
   * id, as the count grouped it.
   */
  idMap: <TFilters>(key: keyof TFilters): GroupNarrowing<TFilters> => ({
    apply: (filters, value) =>
      withFilter(filters, key, value === null ? {} : { [value]: false }),
    supportsNoValue: false,
  }),
  /** `…IdList: number[]` — featurer ids and the like. */
  numberList: <TFilters>(key: keyof TFilters): GroupNarrowing<TFilters> => ({
    apply: (filters, value) => withFilter(filters, key, [Number(value)]),
    supportsNoValue: false,
  }),
  /** A list of plain values — enums, keys. */
  valueList: <TFilters>(key: keyof TFilters): GroupNarrowing<TFilters> => ({
    apply: (filters, value) => withFilter(filters, key, [value]),
    supportsNoValue: false,
  }),
  /** `"ONLY" | "ONLY_NOT" | "ANY"` for a boolean grouped as "true"/"false". */
  ternary: <TFilters>(key: keyof TFilters): GroupNarrowing<TFilters> => ({
    apply: (filters, value) =>
      withFilter(filters, key, value === "true" ? "ONLY" : "ONLY_NOT"),
    supportsNoValue: false,
  }),
};

/** A field the count endpoint groups by, and what the client does with it. */
export type CountGroupField<TGroup, TFilters> = {
  key: string;
  label: string;
  /** The value the count endpoint takes in `groupFields`. */
  groupField: string;
  /** The group's value, as a string; `undefined` for the "not set" group. */
  getValue: (group: TGroup) => string | undefined;
  getText?: (group: TGroup) => string | undefined;
  renderLabel?: (group: TGroup) => ReactNode;
  /**
   * How the search narrows to one group of this field. Without it the field
   * is offered by the pie charts only — the table can't open its groups.
   */
  narrow?: GroupNarrowing<TFilters>;
};

type CountPage<TGroup> = { items: TGroup[]; total: number };

/**
 * Builds both server-side breakdowns of a table from one description of its
 * count fields: the pie charts, and the multi-level grouping of the table view.
 */
export function buildCountGroupings<
  TData,
  TGroup extends { count: number },
  TFilters,
>({
  fields,
  resolveFilters,
  count,
  fetchRows,
}: {
  fields: CountGroupField<TGroup, TFilters>[];
  /** The search filters of the active query — before any group narrows them. */
  resolveFilters: (context: TableQueryContext) => TFilters;
  count: (args: {
    filters: TFilters;
    groupField: string;
    offset: number;
    limit: number;
  }) => Promise<CountPage<TGroup>>;
  /**
   * Searches the rows of the table under the given filters. Without it the
   * table view can't be grouped, only the pie charts are built.
   */
  fetchRows?: (args: {
    filters: TFilters;
    pagination: PaginationState;
    sort?: SortV1;
    search?: string;
  }) => Promise<PagedResponse<TData>>;
}): {
  chartGroupings: (context: TableQueryContext) => ChartGrouping[];
  grouping?: TableGrouping<TData>;
} {
  function chartGroupings(context: TableQueryContext): ChartGrouping[] {
    const filters = resolveFilters(context);

    return fields.map((field) => ({
      key: field.key,
      label: field.label,
      load: buildCountGroupingLoad(
        ({ offset, limit }) =>
          count({ filters, groupField: field.groupField, offset, limit }),
        field.getValue,
        field.getText ?? field.getValue,
        field.renderLabel
      ),
    }));
  }

  const groupable = fields.filter((field) => field.narrow);
  if (!fetchRows || groupable.length === 0) return { chartGroupings };

  function findField(key: string) {
    const field = groupable.find((f) => f.key === key);
    if (!field) throw new Error(`Unknown group field: ${key}`);
    return field;
  }

  function narrow(
    context: TableQueryContext,
    path: { fieldKey: string; value: string | null }[]
  ) {
    return path.reduce(
      (filters, step) =>
        findField(step.fieldKey).narrow!.apply(filters, step.value),
      resolveFilters(context)
    );
  }

  return {
    chartGroupings,
    grouping: {
      fields: groupable.map(({ key, label }) => ({ key, label })),
      countGroups: async ({ fieldKey, path, offset, limit, context }) => {
        const field = findField(fieldKey);
        const { items, total } = await count({
          filters: narrow(context, path),
          groupField: field.groupField,
          offset,
          limit,
        });

        return {
          total,
          items: items.map((group) => {
            const value = field.getValue(group) ?? null;
            return {
              value,
              label:
                field.renderLabel?.(group) ??
                field.getText?.(group) ??
                value ??
                NO_VALUE_GROUP_LABEL,
              count: group.count,
              expandable: value !== null || field.narrow!.supportsNoValue,
            };
          }),
        };
      },
      fetchRows: ({ path, pagination, context }) =>
        fetchRows({
          filters: narrow(context, path),
          pagination,
          sort: context.sort,
          search: context.search,
        }),
    },
  };
}
