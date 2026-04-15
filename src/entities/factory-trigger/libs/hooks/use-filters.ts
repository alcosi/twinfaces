import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useFactorySelectAdapter } from "@/entities/factory";
import {
  FactoryTriggerFilterKeys,
  FactoryTriggerFilters,
} from "@/entities/factory-trigger";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { useTwinTriggerSelectAdapter } from "@/entities/twin-trigger";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArrayOfString,
} from "@/shared/libs";

export function useFactoryTriggerFilters({
  enabledFilters,
}: {
  enabledFilters?: FactoryTriggerFilterKeys[];
}): FilterFeature<FactoryTriggerFilterKeys, FactoryTriggerFilters> {
  const factoryAdapter = useFactorySelectAdapter();
  const triggerAdapter = useTwinTriggerSelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const allFilters: Record<FactoryTriggerFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    twinFactoryIdList: {
      type: AutoFormValueType.combobox,
      label: "Twinflow factory",
      multi: true,
      ...factoryAdapter,
    },
    inputTwinClassIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Input twin class",
      adapter: twinClassAdapter,
      extraFilters: buildTwinClassFilters(),
      mapExtraFilters: (filters) => mapTwinClassFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    twinTriggerIdList: {
      type: AutoFormValueType.combobox,
      label: "Twin trigger",
      multi: true,
      ...triggerAdapter,
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
    FactoryTriggerFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<FactoryTriggerFilterKeys, unknown>
  ): FactoryTriggerFilters {
    return {
      idList: toArrayOfString(filters.idList),
      twinFactoryIdList: toArrayOfString(filters.twinFactoryIdList, "id"),
      inputTwinClassIdList: toArrayOfString(filters.inputTwinClassIdList, "id"),
      twinTriggerIdList: toArrayOfString(filters.twinTriggerIdList, "id"),
      active: mapToChoice(filters.active),
      async: mapToChoice(filters.async),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
