import {
  FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";
import {
  FactoryConditionSetFilterKeys,
  FactoryConditionSetFilters,
} from "../../api";
import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { z } from "zod";

export function useFactoryConditionSetFilters(): FilterFeature<
  FactoryConditionSetFilterKeys,
  FactoryConditionSetFilters
> {
  function buildFilterFields(): Record<
    FactoryConditionSetFilterKeys,
    AutoFormValueInfo
  > {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      nameLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },
      descriptionLikeList: {
        type: AutoFormValueType.string,
        label: "Description",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<FactoryConditionSetFilterKeys, unknown>
  ): FactoryConditionSetFilters {
    return {
      idList: toArrayOfString(filters.idList),
      nameLikeList: toArrayOfString(filters.nameLikeList).map(wrapWithPercent),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
