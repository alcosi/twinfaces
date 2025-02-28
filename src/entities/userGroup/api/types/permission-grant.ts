import { components } from "@/shared/api/generated/schema";

export type PermissionGrantUserGroup =
  components["schemas"]["PermissionGrantUserGroupV2"];
export type PermissionGrantUserGroup_DETAILED =
  Required<PermissionGrantUserGroup>;

export type PermissionGrantUserGroupFilterKeys = "permissionIdList";

export type PermissionGrantUserGroupFilters = Partial<
  Pick<
    components["schemas"]["PermissionGrantUserGroupSearchRqV1"],
    PermissionGrantUserGroupFilterKeys
  >
>;

export type CreatePermissionGrantUserGroupRequestBody =
  components["schemas"]["PermissionGrantUserGroupCreateRqV1"];
