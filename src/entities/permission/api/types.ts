import { PermissionGroup } from "@/entities/permission-group";
import { components, operations } from "@/shared/api/generated/schema";

export type Permission = components["schemas"]["PermissionV1"] & {
  group?: PermissionGroup;
};
export type Permission_DETAILED = Required<Permission>;

export type CreatePermissionRequestBody =
  components["schemas"]["PermissionCreateRqV1"];
export type UpdatePermissionRequestBody =
  components["schemas"]["PermissionUpdateRqV1"];

export type PermissionFilterKeys =
  | "idList"
  | "keyLikeList"
  | "nameLikeList"
  | "descriptionLikeList"
  | "groupIdList";

export type PermissionFilters = Partial<
  Pick<components["schemas"]["PermissionSearchV1"], PermissionFilterKeys>
>;

export type PermissionSortField = NonNullable<
  components["schemas"]["PermissionSearchRqV1"]["sortField"]
>;

export type PermissionCountRq = components["schemas"]["PermissionCountRqV1"];

export type PermissionCountGroupField = NonNullable<
  PermissionCountRq["groupFields"]
>[number];

export type QueryPermissionViewV1 =
  operations["permissionViewV1"]["parameters"]["query"];

export type GrantUserPermissionPayload =
  components["schemas"]["PermissionGrantUserCreateRqV1"];
export type GrantUserGroupPermissionPayload =
  components["schemas"]["PermissionGrantUserGroupCreateRqV1"];

export type GrantTwinRolePermissionPayload =
  components["schemas"]["PermissionGrantTwinRoleCreateRqV1"];

export type GrantSpaceRolePermissionPayload =
  components["schemas"]["PermissionGrantSpaceRoleCreateRqV1"];
