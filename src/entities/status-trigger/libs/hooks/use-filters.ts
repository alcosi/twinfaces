import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { useTwinTriggerSelectAdapter } from "@/entities/twin-trigger";
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
  const twinStatusAdapter = useTwinStatusSelectAdapter();
  const twinTriggerAdapter = useTwinTriggerSelectAdapter();

  const allFilters: Record<StatusTriggerFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
    },
    twinStatusIdList: {
      type: AutoFormValueType.combobox,
      label: "Twin status",
      multi: true,
      ...twinStatusAdapter,
    },
    incomingElseOutgoing: {
      type: AutoFormValueType.boolean,
      label: "Incoming else outgoing",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    twinTriggerIdList: {
      type: AutoFormValueType.combobox,
      label: "Twin trigger",
      multi: true,
      ...twinTriggerAdapter,
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
