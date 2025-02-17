import { RelatedObjects } from "@/shared/api";
import {
  PermissionGrantSpaceRole,
  PermissionGrantSpaceRole_DETAILED,
} from "@/entities/spaceRole";

export const hydratePermissionGrantSpaceRoleFromMap = (
  dto: PermissionGrantSpaceRole,
  relatedObjects?: RelatedObjects
): PermissionGrantSpaceRole_DETAILED => {
  const hydrated: PermissionGrantSpaceRole_DETAILED = Object.assign(
    {},
    dto
  ) as PermissionGrantSpaceRole_DETAILED;

  if (dto.spaceRoleId && relatedObjects?.spaceRoleMap) {
    hydrated.spaceRole = relatedObjects.spaceRoleMap[dto.spaceRoleId]!;
  }

  if (dto.permissionSchemaId && relatedObjects?.permissionSchemaMap) {
    hydrated.permissionSchema =
      relatedObjects.permissionSchemaMap[dto.permissionSchemaId]!;
  }

  if (dto.grantedByUserId && relatedObjects?.userMap) {
    hydrated.grantedByUser = relatedObjects.userMap[dto.grantedByUserId]!;
  }

  return hydrated;
};
