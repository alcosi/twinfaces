import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  type FilterFeature,
  isPopulatedArray,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";
import { z } from "zod";
import { TwinClassFieldV2FilterKeys, TwinClassFieldV2Filters } from "../../api";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { usePermissionSelectAdapter } from "@/entities/permission";
import { useFeaturerSelectAdapter } from "@/entities/featurer";

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
    twinClassIdList: {
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
      type: AutoFormValueType.string,
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
    if (isPopulatedArray(enabledFilters)) {
      return enabledFilters.reduce(
        (filters, key) => {
          filters[key] = allFilters[key];
          return filters;
        },
        {} as Record<TwinClassFieldV2FilterKeys, AutoFormValueInfo>
      );
    }

    return allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<TwinClassFieldV2FilterKeys, unknown>
  ): TwinClassFieldV2Filters {
    const result: TwinClassFieldV2Filters = {
      idList: toArrayOfString(filters.idList),
      twinClassIdList: toArrayOfString(toArray(filters.twinClassIdList), "id"),
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
