import {
  PermissionGrantSpaceRole,
  PermissionGrantSpaceRole_DETAILED,
  SpaceRole,
} from "@/entities/space-role";
import { RelatedObjects } from "@/shared/api";

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

export const hydrateSpaceRoleFromMap = (
  dto: SpaceRole,
  relatedObjects?: RelatedObjects
): SpaceRole => {
  const hydrated: SpaceRole = Object.assign({}, dto) as SpaceRole;

  if (dto.twinClassId && relatedObjects?.twinClassMap) {
    hydrated.twinClass = relatedObjects.twinClassMap[dto.twinClassId];
  }

  return hydrated;
};
