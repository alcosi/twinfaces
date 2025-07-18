import { TwinClass_DETAILED } from "@/entities/twin-class";
import type { components } from "@/shared/api/generated/schema";

export type PermissionGrantTwinRoles =
  components["schemas"]["PermissionGrantTwinRoleV1"];
export type PermissionGrantTwinRoles_DETAILED =
  Required<PermissionGrantTwinRoles> & { twinClass: TwinClass_DETAILED };

export type PermissionGrantTwinRolesFilter =
  components["schemas"]["PermissionGrantTwinRoleSearchRqV1"];
