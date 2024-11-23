import { components } from "@/shared/api/generated/schema";

export type Permission = components["schemas"]["PermissionV2"];
export type Permission_DETAILED = Required<Permission>;

export type CreatePermissionRequestBody =
  components["schemas"]["PermissionCreateRqV1"];
export type UpdatePermissionRequestBody =
  components["schemas"]["PermissionUpdateRqV1"];

export type PermissionFilterKeys =
  | "idList"
  | "keyLikeList"
  | "nameLikeList"
  | "descriptionLikeList";

export type PermissionFilters = Partial<
  Pick<components["schemas"]["PermissionSearchRqV1"], PermissionFilterKeys>
>;
