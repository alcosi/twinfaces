import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { RelatedObjects } from "@/shared/api";
import { toArray, toArrayOfString, wrapWithPercent } from "@/shared/libs";
import {
  PermissionGroup,
  PermissionGroup_DETAILED,
  PermissionGroupApiFilterFields,
  PermissionGroupApiFilters,
} from "../api";

export const mapToPermissionGroupApiFilters = (
  filters: Record<PermissionGroupApiFilterFields, unknown>
): PermissionGroupApiFilters => {
  const result: PermissionGroupApiFilters = {
    idList: toArrayOfString(toArray(filters.idList), "id"),
    keyLikeList: toArrayOfString(toArray(filters.keyLikeList), "key").map(
      wrapWithPercent
    ),
    nameLikeList: toArrayOfString(toArray(filters.nameLikeList), "name").map(
      wrapWithPercent
    ),
    descriptionLikeList: toArrayOfString(
      toArray(filters.descriptionLikeList)
    ).map(wrapWithPercent),
  };

  return result;
};

export function buildFilterFields(
  permissionGroups: PermissionGroup_DETAILED[]
): Record<
  PermissionGroupApiFilterFields,
  // AutoFormValueInfo | AutoFormMultiComboboxValueInfo<PermissionGroup_DETAILED>
  AutoFormValueInfo | any
> {
  return {
    idList: {
      type: AutoFormValueType.combobox,
      label: "Id",
      multi: true,
      getById: async (key: string) =>
        permissionGroups?.find((p: PermissionGroup_DETAILED) => p.key === key),
      getItems: async (needle: string) => {
        return permissionGroups?.filter((p) =>
          p.name?.toLowerCase().includes(needle.toLowerCase())
        );
      },
      getItemKey: (p: PermissionGroup_DETAILED) => p.key,
      getItemLabel: (p: PermissionGroup_DETAILED) => p.id,
    },
    keyLikeList: {
      type: AutoFormValueType.combobox,
      label: "Key",
      multi: true,
      getById: async (key: string) =>
        permissionGroups?.find((p: PermissionGroup_DETAILED) => p.key === key),
      getItems: async (needle: string) => {
        return permissionGroups?.filter((p) =>
          p.name?.toLowerCase().includes(needle.toLowerCase())
        );
      },
      getItemKey: (p: PermissionGroup_DETAILED) => p.key,
      getItemLabel: (p: PermissionGroup_DETAILED) => p.key,
    },
    nameLikeList: {
      type: AutoFormValueType.combobox,
      label: "Name",
      multi: true,
      getById: async (key: string) =>
        permissionGroups?.find((p: PermissionGroup_DETAILED) => p.key === key),
      getItems: async (needle: string) => {
        return permissionGroups?.filter((p) =>
          p.name?.toLowerCase().includes(needle.toLowerCase())
        );
      },
      getItemKey: (p: PermissionGroup_DETAILED) => p.key,
      getItemLabel: (p: PermissionGroup_DETAILED) => p.name ?? p.key,
    },
    descriptionLikeList: {
      type: AutoFormValueType.string,
      label: "Description",
    },
  } as const;
}

export const hydratePermissionGroupFromMap = (
  permissionDTO: PermissionGroup,
  relatedObjects?: RelatedObjects
): PermissionGroup_DETAILED => {
  const hydrated: PermissionGroup_DETAILED = Object.assign(
    {},
    permissionDTO
  ) as PermissionGroup_DETAILED;

  if (permissionDTO.twinClassId && relatedObjects?.twinClassMap) {
    hydrated.twinClass =
      relatedObjects.twinClassMap[permissionDTO.twinClassId]!;
  }

  return hydrated;
};
