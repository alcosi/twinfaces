import { AutoFormValueInfo } from "@/components/auto-field";
import { RelatedObjects } from "@/shared/api";
import { toArray, toArrayOfString, wrapWithPercent } from "@/shared/libs";
import {
  Permission,
  Permission_DETAILED,
  PermissionApiFilterFields,
  PermissionApiFilters,
} from "../api";
import { FILTERS } from "./constants";

export const mapToPermissionApiFilters = (
  filters: Record<PermissionApiFilterFields, unknown>
): PermissionApiFilters => {
  const result: PermissionApiFilters = {
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
  permissions: Permission[]
): Record<PermissionApiFilterFields, AutoFormValueInfo> {
  return {
    idList: {
      ...FILTERS.idList,
      getById: async (key: string) =>
        permissions?.find((p: Permission) => p.key === key),
      getItems: async (needle: string) => {
        return permissions?.filter((p) =>
          p.name?.toLowerCase().includes(needle.toLowerCase())
        );
      },
      getItemKey: (p: Permission) => p.key!,
      getItemLabel: (p: Permission) => p.id!,
    },
    keyLikeList: {
      ...FILTERS.keyLikeList,
      getById: async (key: string) =>
        permissions?.find((p: Permission) => p.key === key),
      getItems: async (needle: string) => {
        return permissions?.filter((p) =>
          p.name?.toLowerCase().includes(needle.toLowerCase())
        );
      },
      getItemKey: (p: Permission) => p.key!,
      getItemLabel: (p: Permission) => p.key!,
    },
    nameLikeList: {
      ...FILTERS.nameLikeList,
      getById: async (key: string) =>
        permissions?.find((p: Permission) => p.key === key),
      getItems: async (needle: string) => {
        return permissions?.filter((p) =>
          p.name?.toLowerCase().includes(needle.toLowerCase())
        );
      },
      getItemKey: (p: Permission) => p.key!,
      getItemLabel: (p: Permission) => p.name ?? p.key!,
    },
    descriptionLikeList: FILTERS.descriptionLikeList,
  };
}

export function groupPermissionsByGroupId(
  permissions: Permission[],
  permissionGroupMap: RelatedObjects["permissionGroupMap"] = {}
) {
  return Object.values(permissionGroupMap).map((group) => ({
    ...group,
    subRows: permissions.filter((p) => p.groupId === group.id),
  }));
}

export const hydratePermissionFromMap = (
  permissionDTO: Permission,
  relatedObjects?: RelatedObjects
): Permission_DETAILED => {
  const permission: Permission_DETAILED = Object.assign(
    {},
    permissionDTO
  ) as Permission_DETAILED;

  if (!relatedObjects?.permissionGroupMap) return permission;

  if (permissionDTO.groupId) {
    permission.group =
      relatedObjects.permissionGroupMap[permissionDTO.groupId]!;
  }

  return permission;
};
