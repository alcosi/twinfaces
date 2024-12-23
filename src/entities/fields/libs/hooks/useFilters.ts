import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  type FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";
import { FieldsFilter, FieldsFilterKeys } from "@/entities/fields";
import { z } from "zod";
import { useTwinClassSelectAdapter } from "@/entities/twinClass";
import { usePermissionSelectAdapter } from "@/entities/permission";
import { useFeaturerSelectAdapter } from "@/entities/featurer";

export function useFieldFilters(): FilterFeature<
  FieldsFilterKeys,
  FieldsFilter
> {
  const tcAdapter = useTwinClassSelectAdapter();
  const pAdapter = usePermissionSelectAdapter();
  const fAdapter = useFeaturerSelectAdapter(13);

  function buildFilterFields(): Record<FieldsFilterKeys, AutoFormValueInfo> {
    return {
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
    } as const;
  }

  function mapFiltersToPayload(
    filters: Record<FieldsFilterKeys, unknown>
  ): FieldsFilter {
    const result: FieldsFilter = {
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
