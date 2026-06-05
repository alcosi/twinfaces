import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useDatalistOptionFilters,
  useDatalistOptionSelectAdapterWithFilters,
} from "@/entities/datalist-option";
import {
  OptionProjectionFilterKeys,
  OptionProjectionFilters,
} from "@/entities/option-projection";
import { useProjectionTypeSelectAdapter } from "@/entities/projection/libs";
import {
  useUserFilters,
  useUserSelectAdapterWithFilters,
} from "@/entities/user";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

export function useOptionProjectionFilters({
  enabledFilters,
}: {
  enabledFilters?: OptionProjectionFilterKeys[];
}): FilterFeature<OptionProjectionFilterKeys, OptionProjectionFilters> {
  const projectionTypeAdapter = useProjectionTypeSelectAdapter();
  const dstDataListOptionAdapter = useDatalistOptionSelectAdapterWithFilters();
  const srcDataListOptionAdapter = useDatalistOptionSelectAdapterWithFilters();
  const savedByUserAdapter = useUserSelectAdapterWithFilters();

  const {
    buildFilterFields: buildDatalistOptionFilters,
    mapFiltersToPayload: mapDatalistOptionFilters,
  } = useDatalistOptionFilters({});
  const {
    buildFilterFields: buildUserFilters,
    mapFiltersToPayload: mapUserFilters,
  } = useUserFilters();

  const allFilters: Record<OptionProjectionFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    projectionTypeIdList: {
      type: AutoFormValueType.combobox,
      label: "Type",
      multi: true,
      ...projectionTypeAdapter,
    },
    dstDataListOptionIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Dst option",
      adapter: dstDataListOptionAdapter,
      extraFilters: buildDatalistOptionFilters(),
      mapExtraFilters: (filters) => mapDatalistOptionFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    srcDataListOptionIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Src option",
      adapter: srcDataListOptionAdapter,
      extraFilters: buildDatalistOptionFilters(),
      mapExtraFilters: (filters) => mapDatalistOptionFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    savedByUserIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Saved by user",
      adapter: savedByUserAdapter,
      extraFilters: buildUserFilters(),
      mapExtraFilters: (filters) => mapUserFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    changedAt: {
      type: AutoFormValueType.dateRange,
      label: "Changed",
    },
  };
  function buildFilterFields(): Record<
    OptionProjectionFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<OptionProjectionFilterKeys, unknown>
  ): OptionProjectionFilters {
    const changedAt = filters.changedAt as { from?: string; to?: string };
    const result: OptionProjectionFilters = {
      idList: toArrayOfString(toArray(filters.idList), "id"),
      projectionTypeIdList: toArrayOfString(
        toArray(filters.projectionTypeIdList),
        "id"
      ),
      dstDataListOptionIdList: toArrayOfString(
        toArray(filters.dstDataListOptionIdList),
        "id"
      ),
      srcDataListOptionIdList: toArrayOfString(
        toArray(filters.srcDataListOptionIdList),
        "id"
      ),
      savedByUserIdList: toArrayOfString(
        toArray(filters.savedByUserIdList),
        "userId"
      ),
      changedAt: {
        from: changedAt?.from ? `${changedAt.from}T00:00:00` : "",
        to: changedAt?.to ? `${changedAt.to}T00:00:00` : "",
      },
    };
    return result;
  }
  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
