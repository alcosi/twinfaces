import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useFeaturerSelectAdapter } from "@/entities/featurer";
import { usePermissionSelectAdapter } from "@/entities/permission";
import {
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import {
  type FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
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
  const tcAdapter = useTwinClassSelectAdapter();
  const pAdapter = usePermissionSelectAdapter();
  const fAdapter = useFeaturerSelectAdapter(13);

  const allFilters: Record<TwinClassFieldV2FilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    twinClassIdMap: {
      type: AutoFormValueType.combobox,
      label: "Twin Class",
      multi: true,
      ...tcAdapter,
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
      ...fAdapter,
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
      viewPermissionIdList: toArrayOfString(
        toArray(filters.viewPermissionIdList),
        "id"
      ),
      editPermissionIdList: toArrayOfString(
        toArray(filters.editPermissionIdList),
        "id"
      ),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
