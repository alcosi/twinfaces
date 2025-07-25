import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { type FilterFeature, toArrayOfString } from "@/shared/libs";

import { FeaturerFilterKeys, FeaturerFilters } from "../../api";

export function useFeaturerFilters(): FilterFeature<
  FeaturerFilterKeys,
  FeaturerFilters
> {
  function buildFilterFields(): Record<FeaturerFilterKeys, AutoFormValueInfo> {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      typeIdList: {
        type: AutoFormValueType.string,
        label: "Type",
      },
      nameLikeList: {
        type: AutoFormValueType.string,
        label: "Name",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<FeaturerFilterKeys, unknown>
  ): FeaturerFilters {
    return {
      typeIdList: toArrayOfString(filters.typeIdList, "id").map(Number),
    };
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
