import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  type FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";
import { z } from "zod";
import { TwinClassFieldV2FilterKeys, TwinClassFieldV2Filters } from "../../api";
import { useTwinClassFieldSelectAdapter } from "./useSelectAdapter";
import { useTwinClassSelectAdapter } from "@/entities/twinClass";
import { usePermissionSelectAdapter } from "@/entities/permission";
import { useFeaturerSelectAdapter } from "@/entities/featurer";

export function useTwinClassFieldFilters(): FilterFeature<
  TwinClassFieldV2FilterKeys,
  TwinClassFieldV2Filters
> {
  const { getById, getItems, renderItem } = useTwinClassFieldSelectAdapter();
  const tcAdapter = useTwinClassSelectAdapter();
  const pAdapter = usePermissionSelectAdapter();
  const fAdapter = useFeaturerSelectAdapter(13);

  function buildFilterFields(): Record<
    TwinClassFieldV2FilterKeys,
    AutoFormValueInfo
  > {
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
