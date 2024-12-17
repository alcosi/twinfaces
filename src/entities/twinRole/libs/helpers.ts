import { RelatedObjects } from "@/shared/api";
import {
  PermissionGrantTwinRoles,
  PermissionGrantTwinRoles_DETAILED,
} from "@/entities/twinRole";

export const hydratePermissionGrantTwinRolesFromMap = (
  permissionGrantTwinRolesDTO: PermissionGrantTwinRoles,
  relatedObjects?: RelatedObjects
): PermissionGrantTwinRoles_DETAILED => {
  const PermissionGrantTwinRoles: PermissionGrantTwinRoles_DETAILED =
    Object.assign(
      {},
      permissionGrantTwinRolesDTO
    ) as PermissionGrantTwinRoles_DETAILED;

  // TODO: Add hydration logic here

  return PermissionGrantTwinRoles;
};
