import type { Permission } from "@/entities/permission";
import type { PermissionSchema } from "@/entities/permission-schema";
import type { User } from "@/entities/user";
import { components } from "@/shared/api/generated/schema";

import type { UserGroup } from "./user-group";

export type PermissionGrantUserGroup =
  components["schemas"]["PermissionGrantUserGroupV1"] & {
    permission?: Permission;
    permissionSchema?: PermissionSchema;
    grantedByUser?: User;
    userGroup?: UserGroup;
  };
export type PermissionGrantUserGroup_DETAILED =
  Required<PermissionGrantUserGroup>;

export type PermissionGrantUserGroupFilterKeys = "permissionIdList";

export type PermissionGrantUserGroupFilters = Partial<
  Pick<
    components["schemas"]["PermissionGrantUserGroupSearchRqV1"],
    PermissionGrantUserGroupFilterKeys
  >
>;
