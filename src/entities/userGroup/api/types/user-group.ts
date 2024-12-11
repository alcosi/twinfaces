import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type UserGroup = components["schemas"]["UserGroupV1"];
export type UserGroup_SHORT = RequireFields<UserGroup, "id" | "name">;
export type UserGroup_DETAILED = RequireFields<
  UserGroup,
  "id" | "name" | "type"
>;

export type UserGroupFilterKeys =
  | "idList"
  | "idExcludeList"
  | "nameLikeList"
  | "nameNotLikeList"
  | "descriptionLikeList"
  | "descriptionNotLikeList"
  | "typeList"
  | "typeExcludeList";

export type UserGroupFilters = Partial<
  Pick<components["schemas"]["UserGroupSearchRqV1"], UserGroupFilterKeys>
>;
