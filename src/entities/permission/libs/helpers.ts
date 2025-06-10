import { RelatedObjects } from "@/shared/api";

import { Permission, Permission_DETAILED } from "../api";

export const hydratePermissionFromMap = (
  dto: Permission,
  relatedObjects?: RelatedObjects
): Permission_DETAILED => {
  const hydrated: Permission_DETAILED = Object.assign(
    {},
    dto
  ) as Permission_DETAILED;

  if (dto.groupId && relatedObjects?.permissionGroupMap) {
    hydrated.group = relatedObjects.permissionGroupMap[dto.groupId]!;
  }

  return hydrated;
};
