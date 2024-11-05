import { components } from "@/shared/api/generated/schema";

export type Permission = components["schemas"]["PermissionV1"];

export type PermissionApiFilterFields =
  | "idList"
  | "keyLikeList"
  | "nameLikeList"
  | "descriptionLikeList";

export type PermissionApiFilters = Partial<
  Pick<components["schemas"]["PermissionSearchRqV1"], PermissionApiFilterFields>
>;
