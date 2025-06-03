import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { FactoryFilterKeys, FactoryFilters } from "@/entities/factory";
import {
  FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

export function useFactoryFilters(): FilterFeature<
  FactoryFilterKeys,
  FactoryFilters
> {
  function buildFilterFields(): Record<FactoryFilterKeys, AutoFormValueInfo> {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      keyLikeList: {
        type: AutoFormValueType.tag,
        label: "Key",
      },
      nameLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },
      descriptionLikeList: {
        type: AutoFormValueType.tag,
        label: "Description",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<FactoryFilterKeys, unknown>
  ): FactoryFilters {
    return {
      idList: toArrayOfString(filters.idList),
      keyLikeList: toArrayOfString(filters.keyLikeList, "key").map(
        wrapWithPercent
      ),
      nameLikeList: toArrayOfString(filters.nameLikeList).map(wrapWithPercent),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
