import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useFactoryConditionSetFilters,
  useFactoryConditionSetSelectAdapterWithFilters,
} from "@/entities/factory-condition-set";
import {
  useFactoryMultiplierFilters,
  useFactoryMultiplierSelectAdapterWithFilters,
} from "@/entities/factory-multiplier/libs";
import {
  useFactoryFilters,
  useFactorySelectAdapterWithFilters,
} from "@/entities/factory/libs";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  FactoryMultiplierFilterFilterKeys,
  FactoryMultiplierFilterFilters,
} from "../../api";

export function useFactoryMultiplierFilterFilters({
  enabledFilters,
}: {
  enabledFilters?: FactoryMultiplierFilterFilterKeys[];
}): FilterFeature<
  FactoryMultiplierFilterFilterKeys,
  FactoryMultiplierFilterFilters
> {
  const factoryAdapter = useFactorySelectAdapterWithFilters();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const factoryConditionSetAdapter =
    useFactoryConditionSetSelectAdapterWithFilters();
  const factoryMultiplierAdapter =
    useFactoryMultiplierSelectAdapterWithFilters();

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();
  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();
  const {
    buildFilterFields: buildFactoryConditionSetFilters,
    mapFiltersToPayload: mapFactoryConditionSetFilters,
  } = useFactoryConditionSetFilters();
  const {
    buildFilterFields: buildFactoryMultiplierFilters,
    mapFiltersToPayload: mapFactoryMultiplierFilters,
  } = useFactoryMultiplierFilters({});

  const allFilters: Record<
    FactoryMultiplierFilterFilterKeys,
    AutoFormValueInfo
  > = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    factoryIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Factory",
      adapter: factoryAdapter,
      extraFilters: buildFactoryFilters(),
      mapExtraFilters: (filters) => mapFactoryFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    factoryMultiplierIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Multiplier",
      adapter: factoryMultiplierAdapter,
      extraFilters: buildFactoryMultiplierFilters(),
      mapExtraFilters: (filters) => mapFactoryMultiplierFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    inputTwinClassIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Input class",
      adapter: twinClassAdapter,
      extraFilters: buildTwinClassFilters(),
      mapExtraFilters: (filters) => mapTwinClassFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    factoryConditionSetIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Condition set",
      adapter: factoryConditionSetAdapter,
      extraFilters: buildFactoryConditionSetFilters(),
      mapExtraFilters: (filters) => mapFactoryConditionSetFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    factoryConditionInvert: {
      type: AutoFormValueType.boolean,
      label: "Condition invert",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    active: {
      type: AutoFormValueType.boolean,
      label: "Active",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    descriptionLikeList: {
      type: AutoFormValueType.tag,
      label: "Description",
    },
  };

  function buildFilterFields(): Record<
    FactoryMultiplierFilterFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<FactoryMultiplierFilterFilterKeys, unknown>
  ): FactoryMultiplierFilterFilters {
    return {
      idList: toArrayOfString(filters.idList),
      factoryIdList: toArrayOfString(filters.factoryIdList, "id"),
      factoryMultiplierIdList: toArrayOfString(
        filters.factoryMultiplierIdList,
        "id"
      ),
      inputTwinClassIdList: toArrayOfString(filters.inputTwinClassIdList, "id"),
      factoryConditionSetIdList: toArrayOfString(
        filters.factoryConditionSetIdList,
        "id"
      ),
      factoryConditionInvert: mapToChoice(filters.factoryConditionInvert),
      active: mapToChoice(filters.active),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
