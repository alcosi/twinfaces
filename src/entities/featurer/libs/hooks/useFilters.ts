import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  type FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { FeaturerFilterKeys, FeaturerFilters } from "../../api";

export function useFeaturerFilters({
  enabledFilters,
}: {
  enabledFilters?: FeaturerFilterKeys[];
} = {}): FilterFeature<FeaturerFilterKeys, FeaturerFilters> {
  const allFilters: Record<FeaturerFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().regex(/^\d+$/, "Please enter a valid ID"),
      placeholder: "Enter ID",
    },
    nameLikeList: {
      type: AutoFormValueType.tag,
      label: "Name",
    },
    descriptionLikeList: {
      type: AutoFormValueType.tag,
      label: "Description",
    },
    deprecated: {
      type: AutoFormValueType.boolean,
      label: "Deprecated",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
  };

  function buildFilterFields(): Record<FeaturerFilterKeys, AutoFormValueInfo> {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<FeaturerFilterKeys, unknown>
  ): FeaturerFilters {
    return {
      idList: toArrayOfString(filters.idList).map(Number),
      nameLikeList: toArrayOfString(filters.nameLikeList).map(wrapWithPercent),
      descriptionLikeList: toArrayOfString(filters.descriptionLikeList).map(
        wrapWithPercent
      ),
      deprecated: mapToChoice(filters.deprecated),
    };
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
