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
import {
  useValidatorSetFilters,
  useValidatorSetSelectAdapterWithFilters,
} from "@/entities/validator-set";
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
  const validatorSetAdapter = useValidatorSetSelectAdapterWithFilters();
  const {
    buildFilterFields: buildValidatorSetFilters,
    mapFiltersToPayload: mapValidatorSetFilters,
  } = useValidatorSetFilters();

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
    twinValidatorSetIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Validator Set",
      adapter: validatorSetAdapter,
      extraFilters: buildValidatorSetFilters(),
      mapExtraFilters: (filters) => mapValidatorSetFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    markerDataListOptionIdList: {
      type: AutoFormValueType.combobox,
      label: "Marker",
      multi: true,
      ...markerAdapter,
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
      twinValidatorSetIdList: toArrayOfString(
        toArray(filters.twinValidatorSetIdList),
        "id"
      ),
      markerDataListOptionIdList: toArrayOfString(
        toArray(filters.markerDataListOptionIdList),
        "markerDataListOptionId"
      ),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
