import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useFactoryFilters,
  useFactorySelectAdapterWithFilters,
} from "@/entities/factory";
import {
  FactoryTriggerFilterKeys,
  FactoryTriggerFilters,
} from "@/entities/factory-trigger";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  useTwinTriggerFilters,
  useTwinTriggerSelectAdapterWithFilters,
} from "@/entities/twin-trigger";
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
  const factoryAdapter = useFactorySelectAdapterWithFilters();
  const triggerAdapter = useTwinTriggerSelectAdapterWithFilters();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();
  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();
  const {
    buildFilterFields: buildTwinTriggerFilters,
    mapFiltersToPayload: mapTwinTriggerFilters,
  } = useTwinTriggerFilters({});

  const allFilters: Record<FactoryTriggerFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    twinFactoryIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Twinflow factory",
      adapter: factoryAdapter,
      extraFilters: buildFactoryFilters(),
      mapExtraFilters: (filters) => mapFactoryFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
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
      type: AutoFormValueType.complexCombobox,
      label: "Twin trigger",
      adapter: triggerAdapter,
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
