import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useFactoryConditionSetFilters,
  useFactoryConditionSetSelectAdapterWithFilters,
} from "@/entities/factory-condition-set";
import {
  useFeaturerFilters,
  useFeaturerSelectAdapterWithFilters,
} from "@/entities/featurer";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { FactoryConditionFilterKeys, FactoryConditionFilters } from "../../api";

export function useFactoryConditionFilters({
  enabledFilters,
}: {
  enabledFilters?: FactoryConditionFilterKeys[];
}): FilterFeature<FactoryConditionFilterKeys, FactoryConditionFilters> {
  const conditionSetAdapter = useFactoryConditionSetSelectAdapterWithFilters();
  const featurerAdapter = useFeaturerSelectAdapterWithFilters(24);

  const {
    buildFilterFields: buildFactoryConditionSetFilters,
    mapFiltersToPayload: mapFactoryConditionSetFilters,
  } = useFactoryConditionSetFilters();
  const {
    buildFilterFields: buildFeaturerFilters,
    mapFiltersToPayload: mapFeaturerFilters,
  } = useFeaturerFilters();

  const allFilters: Record<FactoryConditionFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    factoryConditionSetIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Condition set",
      adapter: conditionSetAdapter,
      extraFilters: buildFactoryConditionSetFilters(),
      mapExtraFilters: (filters) => mapFactoryConditionSetFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    conditionerFeaturerIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Conditioner featurer",
      adapter: featurerAdapter,
      extraFilters: buildFeaturerFilters(),
      mapExtraFilters: (filters) => mapFeaturerFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
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
