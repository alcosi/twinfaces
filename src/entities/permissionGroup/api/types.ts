import { components } from "@/shared/api/generated/schema";

export type PermissionGroup = components["schemas"]["PermissionGroupV1"];
export type PermissionGroup_DETAILED = Required<PermissionGroup>;

export type PermissionGroupFilterKeys =
  | "idList"
  | "keyLikeList"
  | "nameLikeList"
  | "descriptionLikeList";

export type PermissionGroupFilters = Pick<
  components["schemas"]["PermissionGroupSearchRqV1"],
  PermissionGroupFilterKeys
>;
