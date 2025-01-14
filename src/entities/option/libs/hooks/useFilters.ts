import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  type FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";
import { z } from "zod";
import {
  DataListOptionFilterKeys,
  DataListOptionFilters,
} from "@/entities/option";
import { useDatalistSelectAdapter } from "@/entities/datalist";

export function useDatalistOptionFilters(
  config?: Partial<Record<DataListOptionFilterKeys, boolean>>
): FilterFeature<DataListOptionFilterKeys, DataListOptionFilters> {
  const dAdapter = useDatalistSelectAdapter();

  function buildFilterFields(): Record<
    DataListOptionFilterKeys,
    AutoFormValueInfo
  > {
    const allFilters: Record<DataListOptionFilterKeys, AutoFormValueInfo> = {
      idList: {
        type: AutoFormValueType.tag,
        label: "ID",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },

      dataListIdList: {
        type: AutoFormValueType.combobox,
        label: "Datalist",
        multi: true,
        ...dAdapter,
      },

      optionI18nLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },
    };

    return Object.fromEntries(
      Object.entries(allFilters).filter(
        ([key]) => config?.[key as DataListOptionFilterKeys] !== false
      )
    ) as Record<DataListOptionFilterKeys, AutoFormValueInfo>;
  }

  function mapFiltersToPayload(
    filters: Record<DataListOptionFilterKeys, unknown>
  ): DataListOptionFilters {
    const result: DataListOptionFilters = {
      idList: toArrayOfString(toArray(filters.idList), "id"),
      dataListIdList: toArrayOfString(toArray(filters.dataListIdList), "id"),
      optionI18nLikeList: toArrayOfString(filters.optionI18nLikeList).map(
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
