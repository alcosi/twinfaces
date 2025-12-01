import { TwinClass_DETAILED } from "@/entities/twin-class";
import { components, operations } from "@/shared/api/generated/schema";

export type PermissionGroup = components["schemas"]["PermissionGroupV1"] & {
  twinClass?: TwinClass_DETAILED;
};
export type PermissionGroup_DETAILED = Required<PermissionGroup>;

export type PermissionGroupFilterKeys =
  | "idList"
  | "keyLikeList"
  | "twinClassIdList"
  | "nameLikeList"
  | "descriptionLikeList";

export type PermissionGroupFilters = Pick<
  components["schemas"]["PermissionGroupSearchRqV1"],
  PermissionGroupFilterKeys
>;

export type PermissionGroupRqQuery =
  operations["permissionGroupViewV1"]["parameters"]["query"];
