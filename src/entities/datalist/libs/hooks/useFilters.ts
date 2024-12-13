import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  type FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";
import { DatalistFilters, DatalistFilterKeys } from "@/entities/datalist";

export function useDatalistFilters(): FilterFeature<
  DatalistFilterKeys,
  DatalistFilters
> {
  function buildFilterFields(): Record<DatalistFilterKeys, AutoFormValueInfo> {
    return {
      idList: {
        type: AutoFormValueType.uuid,
        label: "Id",
      },
      nameLikeList: {
        type: AutoFormValueType.string,
        label: "Name",
      },
      descriptionLikeList: {
        type: AutoFormValueType.string,
        label: "Description",
      },
      keyLikeList: {
        type: AutoFormValueType.string,
        label: "Key",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<DatalistFilterKeys, unknown>
  ): DatalistFilters {
    const result: DatalistFilters = {
      idList: toArrayOfString(toArray(filters.idList), "id"),
      nameLikeList: toArrayOfString(toArray(filters.nameLikeList), "name").map(
        wrapWithPercent
      ),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
      keyLikeList: toArrayOfString(toArray(filters.keyLikeList), "key").map(
        wrapWithPercent
      ),
    };
    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
