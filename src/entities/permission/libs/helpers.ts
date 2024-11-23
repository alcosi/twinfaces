import { RelatedObjects } from "@/shared/api";
import { Permission, Permission_DETAILED } from "../api";

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
