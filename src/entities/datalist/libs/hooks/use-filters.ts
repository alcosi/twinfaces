import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  type FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";
import { DatalistFilters, DatalistFilterKeys } from "@/entities/datalist";
import { z } from "zod";

export function useDatalistFilters(): FilterFeature<
  DatalistFilterKeys,
  DatalistFilters
> {
  function buildFilterFields(): Record<DatalistFilterKeys, AutoFormValueInfo> {
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
    filters: Record<DatalistFilterKeys, unknown>
  ): DatalistFilters {
    const result: DatalistFilters = {
      idList: toArrayOfString(toArray(filters.idList), "id"),
      keyLikeList: toArrayOfString(toArray(filters.keyLikeList), "key").map(
        wrapWithPercent
      ),
      nameLikeList: toArrayOfString(toArray(filters.nameLikeList), "name").map(
        wrapWithPercent
      ),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
    };
    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
