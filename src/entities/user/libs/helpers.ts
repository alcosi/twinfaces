import { RelatedObjects } from "@/shared/api";

import { PermissionGrantUser, PermissionGrantUser_DETAILED } from "../api";

export const hydratePermissionGrantUserFromMap = (
  dto: PermissionGrantUser,
  relatedObjects?: RelatedObjects
): PermissionGrantUser_DETAILED => {
  const hydrated: PermissionGrantUser_DETAILED = Object.assign(
    {},
    dto
  ) as PermissionGrantUser_DETAILED;

  if (dto.userId && relatedObjects?.userMap) {
    hydrated.user = relatedObjects.userMap[dto.userId]!;
  }

  if (dto.grantedByUserId && relatedObjects?.userMap) {
    hydrated.grantedByUser = relatedObjects.userMap[dto.grantedByUserId]!;
  }

  if (dto.permissionId && relatedObjects?.permissionMap) {
    hydrated.permission = relatedObjects.permissionMap[dto.permissionId]!;
  }

  if (dto.permissionSchemaId && relatedObjects?.permissionSchemaMap) {
    hydrated.permissionSchema =
      relatedObjects.permissionSchemaMap[dto.permissionSchemaId]!;
  }

  return hydrated;
};
