import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { FeaturerTypes, useFeaturerSelectAdapter } from "@/entities/featurer";
import {
  TwinTriggerFilterKeys,
  TwinTriggerFilters,
} from "@/entities/twin-trigger";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

export function useTwinTriggerFilters({
  enabledFilters,
}: {
  enabledFilters?: TwinTriggerFilterKeys[];
}): FilterFeature<TwinTriggerFilterKeys, TwinTriggerFilters> {
  const featurerAdapter = useFeaturerSelectAdapter(FeaturerTypes.trigger);

  const allFilters: Record<TwinTriggerFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
    },
    triggerFeaturerIdList: {
      type: AutoFormValueType.combobox,
      label: "Trigger featurer",
      multi: true,
      ...featurerAdapter,
    },
    active: {
      type: AutoFormValueType.boolean,
      label: "Active",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    nameLikeList: {
      type: AutoFormValueType.tag,
      label: "Name",
    },
  };

  function buildFilterFields(): Record<
    TwinTriggerFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<TwinTriggerFilterKeys, unknown>
  ): TwinTriggerFilters {
    return {
      idList: toArrayOfString(filters.idList),
      triggerFeaturerIdList: toArrayOfString(
        toArray(filters.triggerFeaturerIdList),
        "id"
      ).map(Number),
      active: mapToChoice(filters.active),
      nameLikeList: toArrayOfString(toArray(filters.nameLikeList), "name").map(
        wrapWithPercent
      ),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
