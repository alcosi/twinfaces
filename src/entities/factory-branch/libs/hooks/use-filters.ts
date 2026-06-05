import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useFactoryFilters,
  useFactorySelectAdapterWithFilters,
} from "@/entities/factory";
import {
  useFactoryConditionSetFilters,
  useFactoryConditionSetSelectAdapterWithFilters,
} from "@/entities/factory-condition-set";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { FactoryBranchFilterKeys, FactoryBranchFilters } from "../../api";

export function useFactoryBranchFilters({
  enabledFilters,
}: {
  enabledFilters?: FactoryBranchFilterKeys[];
}): FilterFeature<FactoryBranchFilterKeys, FactoryBranchFilters> {
  const factoryAdapter = useFactorySelectAdapterWithFilters();
  const nextFactoryAdapter = useFactorySelectAdapterWithFilters();
  const factoryConditionSetAdapter =
    useFactoryConditionSetSelectAdapterWithFilters();

  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();
  const {
    buildFilterFields: buildFactoryConditionSetFilters,
    mapFiltersToPayload: mapFactoryConditionSetFilters,
  } = useFactoryConditionSetFilters();

  const allFilters: Record<FactoryBranchFilterKeys, AutoFormValueInfo> = {
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
    conditionInvert: {
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
    nextFactoryIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Next Factory",
      adapter: nextFactoryAdapter,
      extraFilters: buildFactoryFilters(),
      mapExtraFilters: (filters) => mapFactoryFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    descriptionLikeList: {
      type: AutoFormValueType.tag,
      label: "Description",
    },
  };

  function buildFilterFields(): Record<
    FactoryBranchFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<FactoryBranchFilterKeys, unknown>
  ): FactoryBranchFilters {
    return {
      idList: toArrayOfString(filters.idList),
      factoryIdList: toArrayOfString(filters.factoryIdList, "id"),
      factoryConditionSetIdList: toArrayOfString(
        filters.factoryConditionSetIdList,
        "id"
      ),
      active: mapToChoice(filters.active),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
      nextFactoryIdList: toArrayOfString(filters.nextFactoryIdList, "id"),
      conditionInvert: mapToChoice(filters.conditionInvert),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
