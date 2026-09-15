import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { isPopulatedString } from "@/shared/libs";

/** Raw values of a single advanced-filter panel, keyed by filter name. */
export type AdvancedFilterValues = Record<string, any>;

/** Which filters of a panel the user has interacted with, keyed by filter name. */
export type AdvancedFilterTouched = Record<string, boolean>;

export function buildInitialFilterValues(
  extraFilters: Record<string, AutoFormValueInfo | undefined>
): AdvancedFilterValues {
  return Object.fromEntries(
    Object.entries(extraFilters)
      .filter(([, filter]) => filter !== undefined)
      .map(([key, filter]) => [
        key,
        filter!.type === AutoFormValueType.tag
          ? []
          : filter!.type === AutoFormValueType.boolean &&
              filter!.hasIndeterminate
            ? "indeterminate"
            : "",
      ])
  );
}

/** A filter counts as applied once it carries a value the query will use. */
export function isAppliedFilterValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (value === "indeterminate") return false;
  if (typeof value === "string") return isPopulatedString(value);
  // A tri-state checkbox left untouched stays `indeterminate`, so any boolean
  // here is an explicit choice — `false` included.
  if (typeof value === "boolean") return true;
  return typeof value === "object" && value !== null;
}

export function countAppliedFilters(values?: AdvancedFilterValues): number {
  return Object.values(values ?? {}).filter(isAppliedFilterValue).length;
}

export function hasAppliedFilters(values?: AdvancedFilterValues): boolean {
  return countAppliedFilters(values) > 0;
}

export function normalizeFilterValue(
  value: unknown,
  filter: AutoFormValueInfo
) {
  if (filter.type === AutoFormValueType.boolean && filter.hasIndeterminate) {
    return value === undefined ? "indeterminate" : value;
  }

  return value;
}

export function stripIndeterminateFilters(
  filters: AdvancedFilterValues,
  filterInfos: Record<string, AutoFormValueInfo | undefined>,
  touched: AdvancedFilterTouched
) {
  return Object.fromEntries(
    Object.entries(filters).filter(([key, value]) => {
      const info = filterInfos[key];

      if (info?.type === AutoFormValueType.boolean && info.hasIndeterminate) {
        if (!touched[key]) return false;

        return value !== "indeterminate";
      }

      return true;
    })
  );
}
