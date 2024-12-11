import { RelatedObjects } from "@/shared/api";
import {
  PermissionGrantUserGroup,
  PermissionGrantUserGroup_DETAILED,
  UserGroup,
  UserGroup_DETAILED,
} from "../api";

export function hydrateUserGroupFromMap(
  dto: UserGroup,
  relatedObjects?: RelatedObjects
) {
  const hydrated: UserGroup_DETAILED = Object.assign(
    {},
    dto
  ) as UserGroup_DETAILED;

  // Add valid logic here

  return hydrated;
}

export const hydratePermissionGrantUserGroupFromMap = (
  dto: PermissionGrantUserGroup,
  relatedObjects?: RelatedObjects
): PermissionGrantUserGroup_DETAILED => {
  const hydrated: PermissionGrantUserGroup_DETAILED = Object.assign(
    {},
    dto
  ) as PermissionGrantUserGroup_DETAILED;

  if (dto.grantedByUserId && relatedObjects?.userMap) {
    hydrated.grantedByUser = relatedObjects.userMap[dto.grantedByUserId]!;
  }

  if (dto.userGroupId && relatedObjects?.userGroupMap) {
    hydrated.userGroup = relatedObjects.userGroupMap[dto.userGroupId]!;
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
