import { type components } from "@/shared/api/generated/schema";

export type PermissionGrantUser =
  components["schemas"]["PermissionGrantUserV2"];
export type PermissionGrantUser_DETAILED = Required<PermissionGrantUser>;

export type PermissionGrantUserFilterKeys = "permissionIdList";

export type PermissionGrantUserFilters = Partial<
  Pick<
    components["schemas"]["PermissionGrantUserSearchRqV1"],
    PermissionGrantUserFilterKeys
  >
>;
