import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { useDatalistSelectAdapter } from "@/entities/datalist";
import {
  DATALIST_OPTION_STATUS_TYPES,
  DataListOptionFilterKeys,
  DataListOptionFilters,
} from "@/entities/datalist-option";
import {
  createFixedSelectAdapter,
  type FilterFeature,
  isPopulatedArray,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";
import { z } from "zod";

export function useDatalistOptionFilters({
  enabledFilters,
}: {
  enabledFilters?: DataListOptionFilterKeys[];
}): FilterFeature<DataListOptionFilterKeys, DataListOptionFilters> {
  const dAdapter = useDatalistSelectAdapter();

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

    statusIdList: {
      type: AutoFormValueType.combobox,
      label: "Status",
      ...createFixedSelectAdapter(DATALIST_OPTION_STATUS_TYPES),
      multi: true,
    },
  };

  function buildFilterFields(): Record<
    DataListOptionFilterKeys,
    AutoFormValueInfo
  > {
    if (isPopulatedArray(enabledFilters)) {
      return enabledFilters.reduce(
        (filters, key) => {
          filters[key] = allFilters[key];
          return filters;
        },
        {} as Record<DataListOptionFilterKeys, AutoFormValueInfo>
      );
    }

    return allFilters;
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
      statusIdList: toArray(
        filters.statusIdList as DataListOptionFilters["statusIdList"]
      ),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
