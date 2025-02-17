import type { components } from "@/shared/api/generated/schema";

export type PermissionGrantSpaceRole =
  components["schemas"]["PermissionGrantSpaceRoleV2"];
export type PermissionGrantSpaceRole_DETAILED =
  Required<PermissionGrantSpaceRole>;

export type PermissionGrantSpaceRoleFilter =
  components["schemas"]["PermissionGrantSpaceRoleSearchRqV1"];

export type SpaceRole = components["schemas"]["SpaceRoleV2"];
