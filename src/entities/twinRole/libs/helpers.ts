import { RelatedObjects } from "@/shared/api";
import {
  PermissionGrantTwinRoles,
  PermissionGrantTwinRoles_DETAILED,
} from "@/entities/twinRole";
import { TwinClass_DETAILED } from "@/entities/twinClass";

export const hydratePermissionGrantTwinRolesFromMap = (
  dto: PermissionGrantTwinRoles,
  relatedObjects?: RelatedObjects
): PermissionGrantTwinRoles_DETAILED => {
  const hydrated: PermissionGrantTwinRoles_DETAILED = Object.assign(
    {},
    dto
  ) as PermissionGrantTwinRoles_DETAILED;

  if (dto.permissionSchemaId && relatedObjects?.permissionSchemaMap) {
    hydrated.permissionSchema =
      relatedObjects.permissionSchemaMap[dto.permissionSchemaId]!;
  }

  if (dto.twinClassId && relatedObjects?.twinClassMap) {
    hydrated.twinClass = relatedObjects.twinClassMap[
      dto.twinClassId
    ] as TwinClass_DETAILED;
  }

  if (dto.grantedByUserId && relatedObjects?.userMap) {
    hydrated.grantedByUser = relatedObjects.userMap[dto.grantedByUserId]!;
  }

  return hydrated;
};
