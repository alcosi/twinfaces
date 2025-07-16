import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type User = components["schemas"]["UserV1"];
export type User_DETAILED = RequireFields<User, "id" | "fullName">;
export type UserUpdateRq = components["schemas"]["UserUpdateRqV1"];

export type QueryUserPermissionViewV1 =
  operations["permissionViewV1"]["parameters"]["query"];

export type QueryUserPermissionGroupViewV1 =
  operations["permissionGroupViewV1"]["parameters"]["query"];
