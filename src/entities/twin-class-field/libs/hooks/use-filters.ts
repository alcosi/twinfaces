import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useFeaturerSelectAdapter } from "@/entities/featurer";
import { usePermissionSelectAdapter } from "@/entities/permission";
import {
  TwinClass_DETAILED,
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  type FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  reduceToObject,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { TwinClassFieldV2FilterKeys, TwinClassFieldV2Filters } from "../../api";

export function useTwinClassFieldFilters({
  enabledFilters,
}: {
  enabledFilters?: TwinClassFieldV2FilterKeys[];
}): FilterFeature<TwinClassFieldV2FilterKeys, TwinClassFieldV2Filters> {
  const pAdapter = usePermissionSelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();
  const fieldTyperAdapter = useFeaturerSelectAdapter(13);
  const twinSorterAdapter = useFeaturerSelectAdapter(41);

  const allFilters: Record<TwinClassFieldV2FilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    twinClassIdMap: {
      type: AutoFormValueType.complexCombobox,
      label: "Twin Class",
      adapter: twinClassAdapter,
      extraFilters: buildTwinClassFilters(),
      mapExtraFilters: (filters) => mapTwinClassFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    keyLikeList: {
      type: AutoFormValueType.tag,
      label: "Key",
    },
    nameI18nLikeList: {
      type: AutoFormValueType.tag,
      label: "Name",
    },
    descriptionI18nLikeList: {
      type: AutoFormValueType.tag,
      label: "Description",
    },
    fieldTyperIdList: {
      type: AutoFormValueType.combobox,
      label: "Field typer",
      multi: true,
      ...fieldTyperAdapter,
    },
    twinSorterIdList: {
      type: AutoFormValueType.combobox,
      label: "Twin sorter",
      multi: true,
      ...twinSorterAdapter,
    },
    viewPermissionIdList: {
      type: AutoFormValueType.combobox,
      label: "View permission",
      multi: true,
      ...pAdapter,
    },
    editPermissionIdList: {
      type: AutoFormValueType.combobox,
      label: "Edit permission",
      multi: true,
      ...pAdapter,
    },
    required: {
      type: AutoFormValueType.boolean,
      label: "Required",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    system: {
      type: AutoFormValueType.boolean,
      label: "System",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    dependentField: {
      type: AutoFormValueType.boolean,
      label: "Dependent",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    hasDependentFields: {
      type: AutoFormValueType.boolean,
      label: "Has dependents",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    projectionField: {
      type: AutoFormValueType.boolean,
      label: "Projected",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    hasProjectionFields: {
      type: AutoFormValueType.boolean,
      label: "Has projections",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
  };

  function buildFilterFields(): Record<
    TwinClassFieldV2FilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<TwinClassFieldV2FilterKeys, unknown>
  ): TwinClassFieldV2Filters {
    const result: TwinClassFieldV2Filters = {
      idList: toArrayOfString(filters.idList),
      twinClassIdMap: reduceToObject({
        list: toArray(filters.twinClassIdMap) as TwinClass_DETAILED[],
        defaultValue: true,
      }),
      keyLikeList: toArrayOfString(filters.keyLikeList).map(wrapWithPercent),
      nameI18nLikeList: toArrayOfString(filters.nameI18nLikeList).map(
        wrapWithPercent
      ),
      descriptionI18nLikeList: toArrayOfString(
        toArray(filters.descriptionI18nLikeList),
        "description"
      ).map(wrapWithPercent),
      fieldTyperIdList: toArrayOfString(
        toArray(filters.fieldTyperIdList),
        "id"
      ).map(Number),
      twinSorterIdList: toArrayOfString(
        toArray(filters.twinSorterIdList),
        "id"
      ).map(Number),
      viewPermissionIdList: toArrayOfString(
        toArray(filters.viewPermissionIdList),
        "id"
      ),
      editPermissionIdList: toArrayOfString(
        toArray(filters.editPermissionIdList),
        "id"
      ),
      required: mapToChoice(filters.required),
      system: mapToChoice(filters.system),
      dependentField: mapToChoice(filters.dependentField),
      hasDependentFields: mapToChoice(filters.hasDependentFields),
      projectionField: mapToChoice(filters.projectionField),
      hasProjectionFields: mapToChoice(filters.hasProjectionFields),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
