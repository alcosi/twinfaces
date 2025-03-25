import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useFactorySelectAdapter } from "@/entities/factory";
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
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
  const factoryAdapter = useFactorySelectAdapter();
  const factoryConditionSetAdapter = useFactoryConditionSetSelectAdapter();

  const allFilters: Record<FactoryBranchFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    factoryIdList: {
      type: AutoFormValueType.combobox,
      label: "Factory",
      multi: true,
      ...factoryAdapter,
    },
    factoryConditionSetIdList: {
      type: AutoFormValueType.combobox,
      label: "Condition set",
      multi: true,
      ...factoryConditionSetAdapter,
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
      type: AutoFormValueType.combobox,
      label: "Next Factory",
      multi: true,
      ...factoryAdapter,
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
