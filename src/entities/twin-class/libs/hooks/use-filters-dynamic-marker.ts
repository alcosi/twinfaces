import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  TwinClassDynamicMarkerFilterKeys,
  TwinClassDynamicMarkerFilters,
  TwinClass_DETAILED,
  useTwinClassDynamicMarkerSelectAdapter,
  useTwinClassFilters,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { useValidatorSetSelectAdapter } from "@/entities/validator-set";
import {
  type FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  reduceToObject,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

export function useTwinClassDynamicMarkerFilters({
  enabledFilters,
}: {
  enabledFilters?: TwinClassDynamicMarkerFilterKeys[];
}): FilterFeature<
  TwinClassDynamicMarkerFilterKeys,
  TwinClassDynamicMarkerFilters
> {
  const twinClassAdapter = useTwinClassSelectAdapter();
  const markerAdapter = useTwinClassDynamicMarkerSelectAdapter();
  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();
  const validatorSetAdapter = useValidatorSetSelectAdapter();

  const allFilters: Record<
    TwinClassDynamicMarkerFilterKeys,
    AutoFormValueInfo
  > = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    twinClassIdMap: {
      type: AutoFormValueType.complexCombobox,
      label: "Twin Class",
      adapter: twinClassAdapter,
      extraFilters: buildTwinClassFilters(),
      mapExtraFilters: (filters) => mapTwinClassFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    // twinValidatorSetIdList: {
    //   type: AutoFormValueType.tag,
    //   label: "Validator set",
    //   schema: z.string().uuid("Please enter a valid UUID"),
    //   placeholder: "Enter UUID",
    // },
    markerDataListOptionIdList: {
      type: AutoFormValueType.combobox,
      label: "Marker",
      multi: true,
      ...markerAdapter,
    },
    twinValidatorSetIdList: {
      type: AutoFormValueType.combobox,
      label: "Validator Set",
      ...validatorSetAdapter,
      multi: true,
    },
  };

  function buildFilterFields(): Record<
    TwinClassDynamicMarkerFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<TwinClassDynamicMarkerFilterKeys, unknown>
  ): TwinClassDynamicMarkerFilters {
    const result: TwinClassDynamicMarkerFilters = {
      idList: toArrayOfString(filters.idList),
      twinClassIdMap: reduceToObject({
        list: toArray(filters.twinClassIdMap) as TwinClass_DETAILED[],
        defaultValue: true,
      }),
      markerDataListOptionIdList: toArrayOfString(
        toArray(filters.markerDataListOptionIdList),
        "markerDataListOptionId"
      ),
      twinValidatorSetIdList: toArrayOfString(
        toArray(filters.twinValidatorSetIdList),
        "id"
      ),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
