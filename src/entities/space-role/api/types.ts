import { PermissionSchema } from "@/entities/permission-schema";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { User } from "@/entities/user";
import type { components } from "@/shared/api/generated/schema";

export type PermissionGrantSpaceRole =
  components["schemas"]["PermissionGrantSpaceRoleV1"] & {
    spaceRole?: SpaceRole;
    permissionSchema?: PermissionSchema;
    grantedByUser?: User;
  };
export type PermissionGrantSpaceRole_DETAILED =
  Required<PermissionGrantSpaceRole>;

export type PermissionGrantSpaceRoleFilters =
  components["schemas"]["PermissionGrantSpaceRoleSearchRqV1"];
export type SpaceRoleFilters = components["schemas"]["SpaceRoleSearchRqV1"];

export type SpaceRole = components["schemas"]["SpaceRoleV1"] & {
  twinClass?: TwinClass_DETAILED;
};
