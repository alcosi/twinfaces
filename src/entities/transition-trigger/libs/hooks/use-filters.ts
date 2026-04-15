import z from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useTransitionSelectAdapter } from "@/entities/twin-flow-transition";
import { useTwinTriggerSelectAdapter } from "@/entities/twin-trigger";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

import {
  TransitionTriggerFilterKeys,
  TransitionTriggerFilters,
} from "../../api/types";

export function useTransitionTriggerFilters({
  enabledFilters,
}: {
  enabledFilters?: TransitionTriggerFilterKeys[];
}): FilterFeature<TransitionTriggerFilterKeys, TransitionTriggerFilters> {
  const transitionAdapter = useTransitionSelectAdapter();
  const twinTriggerAdapter = useTwinTriggerSelectAdapter();

  const allFilters: Record<TransitionTriggerFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
      schema: z.string().uuid("Please enter a valid UUID"),
    },
    twinflowTransitionIdList: {
      type: AutoFormValueType.combobox,
      label: "Twinflow transition",
      ...transitionAdapter,
    },
    twinTriggerIdList: {
      type: AutoFormValueType.combobox,
      label: "Twin trigger",
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
    TransitionTriggerFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<TransitionTriggerFilterKeys, unknown>
  ): TransitionTriggerFilters {
    return {
      idList: toArrayOfString(filters.idList),
      twinflowTransitionIdList: toArrayOfString(
        toArray(filters.twinflowTransitionIdList),
        "id"
      ),
      twinTriggerIdList: toArrayOfString(
        toArray(filters.twinTriggerIdList),
        "id"
      ),
      active: mapToChoice(filters.active),
      async: mapToChoice(filters.async),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
