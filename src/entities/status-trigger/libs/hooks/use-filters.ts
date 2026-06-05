import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useStatusFilters,
  useTwinStatusSelectAdapterWithFilters,
} from "@/entities/twin-status";
import {
  useTwinTriggerFilters,
  useTwinTriggerSelectAdapterWithFilters,
} from "@/entities/twin-trigger";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

import { StatusTriggerFilterKeys, StatusTriggerFilters } from "../../api/types";

export function useStatusTriggerFilters({
  enabledFilters,
}: {
  enabledFilters?: StatusTriggerFilterKeys[];
}): FilterFeature<StatusTriggerFilterKeys, StatusTriggerFilters> {
  const twinStatusAdapter = useTwinStatusSelectAdapterWithFilters();
  const twinTriggerAdapter = useTwinTriggerSelectAdapterWithFilters();

  const {
    buildFilterFields: buildStatusFilters,
    mapFiltersToPayload: mapStatusFilters,
  } = useStatusFilters({ enabledFilters: undefined });
  const {
    buildFilterFields: buildTwinTriggerFilters,
    mapFiltersToPayload: mapTwinTriggerFilters,
  } = useTwinTriggerFilters({});

  const allFilters: Record<StatusTriggerFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
    },
    twinStatusIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Twin status",
      adapter: twinStatusAdapter,
      extraFilters: buildStatusFilters(),
      mapExtraFilters: (filters) => mapStatusFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    incomingElseOutgoing: {
      type: AutoFormValueType.boolean,
      label: "Incoming else outgoing",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    twinTriggerIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Twin trigger",
      adapter: twinTriggerAdapter,
      extraFilters: buildTwinTriggerFilters(),
      mapExtraFilters: (filters) => mapTwinTriggerFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    active: {
      type: AutoFormValueType.boolean,
      label: "Active",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    async: {
      type: AutoFormValueType.boolean,
      label: "Async",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
  };

  function buildFilterFields(): Record<
    StatusTriggerFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<StatusTriggerFilterKeys, unknown>
  ): StatusTriggerFilters {
    return {
      idList: toArrayOfString(filters.idList),
      twinStatusIdList: toArrayOfString(
        toArray(filters.twinStatusIdList),
        "id"
      ).map(String),
      incomingElseOutgoing: mapToChoice(filters.incomingElseOutgoing),
      twinTriggerIdList: toArrayOfString(
        toArray(filters.twinTriggerIdList),
        "id"
      ).map(String),
      active: mapToChoice(filters.active),
      async: mapToChoice(filters.async),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
