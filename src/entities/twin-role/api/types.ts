import { PermissionSchema } from "@/entities/permission-schema";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { User } from "@/entities/user";
import type { components } from "@/shared/api/generated/schema";

export type PermissionGrantTwinRoles =
  components["schemas"]["PermissionGrantTwinRoleV1"] & {
    permissionSchema?: PermissionSchema;
    grantedByUser?: User;
  };
export type PermissionGrantTwinRoles_DETAILED =
  Required<PermissionGrantTwinRoles> & { twinClass: TwinClass_DETAILED };

export type PermissionGrantTwinRolesFilter =
  components["schemas"]["PermissionGrantTwinRoleSearchRqV1"];
