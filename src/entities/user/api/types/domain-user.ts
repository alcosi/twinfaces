import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type DomainUser = components["schemas"]["DomainUserV2"];
export type DomainUser_SHORT = RequireFields<DomainUser, "id" | "userId">;
export type DomainUser_DETAILED = RequireFields<
  DomainUser_SHORT,
  "currentLocale" | "createdAt" | "user"
>;

export type DomainUserFilterKeys =
  | "userIdList"
  | "userIdExcludeList"
  | "nameLikeList"
  | "nameNotLikeList"
  | "emailLikeList"
  | "emailNotLikeList"
  | "statusIdList"
  | "statusIdExcludeList"
  | "businessAccountIdList"
  | "businessAccountIdExcludeList";

export type DomainUserFilters = Partial<
  Pick<components["schemas"]["DomainUserSearchRqV1"], DomainUserFilterKeys>
>;
