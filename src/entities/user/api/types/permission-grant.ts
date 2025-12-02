import type { Permission } from "@/entities/permission";
import type { PermissionSchema } from "@/entities/permission-schema";
import type { User } from "@/entities/user";
import { type components } from "@/shared/api/generated/schema";

export type PermissionGrantUser =
  components["schemas"]["PermissionGrantUserV1"] & {
    user?: User;
    grantedByUser?: User;
    permission?: Permission;
    permissionSchema?: PermissionSchema;
  };
export type PermissionGrantUser_DETAILED = Required<PermissionGrantUser>;

export type PermissionGrantUserFilterKeys = "permissionIdList";

export type PermissionGrantUserFilters = Partial<
  Pick<
    components["schemas"]["PermissionGrantUserSearchRqV1"],
    PermissionGrantUserFilterKeys
  >
>;
