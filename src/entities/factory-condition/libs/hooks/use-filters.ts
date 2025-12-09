import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useFeaturerSelectAdapter } from "@/entities/featurer";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { FactoryConditionFilterKeys, FactoryConditionFilters } from "../../api";
import { useFactoryConditionSelectAdapter } from "./use-select-adapter";

export function useFactoryConditionFilters({
  enabledFilters,
}: {
  enabledFilters?: FactoryConditionFilterKeys[];
}): FilterFeature<FactoryConditionFilterKeys, FactoryConditionFilters> {
  const conditionSetAdapter = useFactoryConditionSelectAdapter();
  const featurerAdapter = useFeaturerSelectAdapter(24);

  const allFilters: Record<FactoryConditionFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    factoryConditionSetIdList: {
      type: AutoFormValueType.combobox,
      label: "Condition set",
      multi: true,
      ...conditionSetAdapter,
    },
    conditionerFeaturerIdList: {
      type: AutoFormValueType.combobox,
      label: "Conditioner featurer",
      multi: true,
      ...featurerAdapter,
    },
    descriptionLikeList: {
      type: AutoFormValueType.tag,
      label: "Description",
    },
    invert: {
      type: AutoFormValueType.boolean,
      label: "Invert",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    active: {
      type: AutoFormValueType.boolean,
      label: "Active",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
  };

  function buildFilterFields(): Record<
    FactoryConditionFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<FactoryConditionFilterKeys, unknown>
  ): FactoryConditionFilters {
    return {
      idList: toArrayOfString(filters.idList),
      factoryConditionSetIdList: toArrayOfString(
        filters.factoryConditionSetIdList,
        "id"
      ),
      conditionerFeaturerIdList: toArrayOfString(
        filters.conditionerFeaturerIdList,
        "id"
      ).map(Number),
      descriptionLikeList: toArrayOfString(filters.descriptionLikeList).map(
        wrapWithPercent
      ),
      invert: mapToChoice(filters.invert),
      active: mapToChoice(filters.active),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
