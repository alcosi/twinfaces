import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useDatalistFilters,
  useDatalistSelectAdapterWithFilters,
} from "@/entities/datalist";
import {
  DATALIST_OPTION_STATUS_TYPES,
  DataListOptionFilterKeys,
  DataListOptionFilters,
} from "@/entities/datalist-option";
import {
  type FilterFeature,
  createFixedSelectAdapter,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

export function useDatalistOptionFilters({
  enabledFilters,
}: {
  enabledFilters?: DataListOptionFilterKeys[];
}): FilterFeature<DataListOptionFilterKeys, DataListOptionFilters> {
  const dAdapter = useDatalistSelectAdapterWithFilters();

  const {
    buildFilterFields: buildDatalistFilters,
    mapFiltersToPayload: mapDatalistFilters,
  } = useDatalistFilters();

  const allFilters: Record<DataListOptionFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },

    dataListIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Datalist",
      adapter: dAdapter,
      extraFilters: buildDatalistFilters(),
      mapExtraFilters: (filters) => mapDatalistFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
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

    custom: {
      type: AutoFormValueType.boolean,
      label: "Custom",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
  };

  function buildFilterFields(): Record<
    DataListOptionFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
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
      custom: mapToChoice(filters.custom),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
