import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  OWNER_TYPES,
  TwinClass_DETAILED,
  TwinClassFilterKeys,
  TwinClassFilters,
  useTwinClassSelectAdapter,
} from "@/entities/twinClass";
import {
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
  type FilterFeature,
} from "@/shared/libs";

export function useTwinClassFilters(): FilterFeature<
  TwinClassFilterKeys,
  TwinClassFilters
> {
  const { getById, getItems, getItemKey, getItemLabel } =
    useTwinClassSelectAdapter();

  function buildFilterFields(): Record<TwinClassFilterKeys, AutoFormValueInfo> {
    return {
      twinClassIdList: {
        type: AutoFormValueType.uuid,
        label: "Id",
      },
      twinClassKeyLikeList: {
        type: AutoFormValueType.string,
        label: "Key",
      },
      nameI18nLikeList: {
        type: AutoFormValueType.string,
        label: "Name",
      },
      descriptionI18nLikeList: {
        type: AutoFormValueType.string,
        label: "Description",
      },
      headTwinClassIdList: {
        type: AutoFormValueType.multiCombobox,
        label: "Head",
        getById,
        getItems,
        getItemKey: (item: unknown) => getItemKey(item as TwinClass_DETAILED),
        getItemLabel: (item: unknown) =>
          getItemLabel(item as TwinClass_DETAILED),
        multi: true,
      },
      extendsTwinClassIdList: {
        type: AutoFormValueType.multiCombobox,
        label: "Extends",
        getById,
        getItems,
        getItemKey: (item: unknown) => getItemKey(item as TwinClass_DETAILED),
        getItemLabel: (item: unknown) =>
          getItemLabel(item as TwinClass_DETAILED),
        multi: true,
      },
      ownerTypeList: {
        type: AutoFormValueType.multiCombobox,
        label: "Owner types",
        getById: async (key: string) => OWNER_TYPES?.find((o) => o === key),
        getItems: async (needle: string) => {
          return OWNER_TYPES?.filter((type) =>
            type.toLowerCase().includes(needle.toLowerCase())
          );
        },
        getItemKey: (o: unknown) => o as string,
        getItemLabel: (o: unknown) => o as string,
        multi: true,
      },
      twinflowSchemaSpace: {
        type: AutoFormValueType.boolean,
        label: "Twinflow schema space",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      twinClassSchemaSpace: {
        type: AutoFormValueType.boolean,
        label: "Twinclass schema space",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      permissionSchemaSpace: {
        type: AutoFormValueType.boolean,
        label: "Permission schema space",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      aliasSpace: {
        type: AutoFormValueType.boolean,
        label: "Alias space",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      abstractt: {
        type: AutoFormValueType.boolean,
        label: "Abstract",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<TwinClassFilterKeys, unknown>
  ): TwinClassFilters {
    const result: TwinClassFilters = {
      twinClassIdList: toArrayOfString(toArray(filters.twinClassIdList), "id"),
      nameI18nLikeList: toArrayOfString(
        toArray(filters.nameI18nLikeList),
        "name"
      ).map(wrapWithPercent),
      descriptionI18nLikeList: toArrayOfString(
        toArray(filters.descriptionI18nLikeList),
        "description"
      ).map(wrapWithPercent),
      headTwinClassIdList: toArrayOfString(
        toArray(filters.headTwinClassIdList),
        "id"
      ),
      extendsTwinClassIdList: toArrayOfString(
        toArray(filters.extendsTwinClassIdList),
        "id"
      ),
      ownerTypeList: toArray(
        filters.ownerTypeList as TwinClassFilters["ownerTypeList"]
      ),
      twinflowSchemaSpace: mapToChoice(filters.twinflowSchemaSpace),
      twinClassSchemaSpace: mapToChoice(filters.twinClassSchemaSpace),
      permissionSchemaSpace: mapToChoice(filters.permissionSchemaSpace),
      aliasSpace: mapToChoice(filters.aliasSpace),
      abstractt: mapToChoice(filters.abstractt),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
