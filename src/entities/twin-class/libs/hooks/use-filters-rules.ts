import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useFeaturerFilters,
  useFeaturerSelectAdapterWithFilters,
} from "@/entities/featurer";
import {
  useTwinClassFieldFilters,
  useTwinClassFieldSelectAdapterWithFilters,
} from "@/entities/twin-class-field";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

import { RuleFilterKeys, RuleFilters } from "../../api";

export function useRulesFilters({
  enabledFilters,
}: {
  enabledFilters?: RuleFilterKeys[];
}): FilterFeature<RuleFilterKeys, RuleFilters> {
  const twinClassFieldAdapter = useTwinClassFieldSelectAdapterWithFilters();
  const featurerAdapter = useFeaturerSelectAdapterWithFilters(46);

  const {
    buildFilterFields: buildTwinClassFieldFilters,
    mapFiltersToPayload: mapTwinClassFieldFilters,
  } = useTwinClassFieldFilters({});
  const {
    buildFilterFields: buildFeaturerFilters,
    mapFiltersToPayload: mapFeaturerFilters,
  } = useFeaturerFilters();
  const allFilters: Record<RuleFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
    },
    twinClassFieldIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Fields",
      adapter: twinClassFieldAdapter,
      extraFilters: buildTwinClassFieldFilters(),
      mapExtraFilters: (filters) => mapTwinClassFieldFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    fieldOverwriterFeaturerIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Overwriter",
      adapter: featurerAdapter,
      extraFilters: buildFeaturerFilters(),
      mapExtraFilters: (filters) => mapFeaturerFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
  };

  function buildFilterFields(): Record<RuleFilterKeys, AutoFormValueInfo> {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<RuleFilterKeys, unknown>
  ): RuleFilters {
    return {
      idList: toArrayOfString(filters.idList),
      twinClassFieldIdList: toArrayOfString(
        toArray(filters.twinClassFieldIdList),
        "id"
      ),
      fieldOverwriterFeaturerIdList: toArrayOfString(
        filters.fieldOverwriterFeaturerIdList,
        "id"
      ).map(Number),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
