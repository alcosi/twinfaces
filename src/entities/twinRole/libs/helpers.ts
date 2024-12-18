import { RelatedObjects } from "@/shared/api";
import {
  PermissionGrantTwinRoles,
  PermissionGrantTwinRoles_DETAILED,
} from "@/entities/twinRole";
import { TwinClass_DETAILED } from "@/entities/twinClass";

export const hydratePermissionGrantTwinRolesFromMap = (
  permissionGrantTwinRolesDTO: PermissionGrantTwinRoles,
  relatedObjects?: RelatedObjects
): PermissionGrantTwinRoles_DETAILED => {
  const permissionGrantTwinRoles: PermissionGrantTwinRoles_DETAILED =
    Object.assign(
      {},
      permissionGrantTwinRolesDTO
    ) as PermissionGrantTwinRoles_DETAILED;

  if (
    permissionGrantTwinRolesDTO.permissionSchemaId &&
    relatedObjects?.permissionSchemaMap
  ) {
    permissionGrantTwinRoles.permissionSchema =
      relatedObjects.permissionSchemaMap[
        permissionGrantTwinRolesDTO.permissionSchemaId
      ]!;
  }

  if (permissionGrantTwinRolesDTO.twinClassId && relatedObjects?.twinClassMap) {
    permissionGrantTwinRoles.twinClass = relatedObjects.twinClassMap[
      permissionGrantTwinRolesDTO.twinClassId
    ] as TwinClass_DETAILED;
  }

  if (permissionGrantTwinRolesDTO.grantedByUserId && relatedObjects?.userMap) {
    permissionGrantTwinRoles.grantedByUser =
      relatedObjects.userMap[permissionGrantTwinRolesDTO.grantedByUserId]!;
  }

  return permissionGrantTwinRoles;
};
