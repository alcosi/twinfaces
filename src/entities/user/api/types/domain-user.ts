import type { User } from "@/entities/user";
import type { UserGroup } from "@/entities/user-group";
import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type DomainUser = components["schemas"]["DomainUserV1"] & {
  user?: User;
  // Resolved from user.userGroupIds + relatedObjects.userGroupMap
  userGroups?: UserGroup[];
};
export type DomainUser_SHORT = RequireFields<DomainUser, "id" | "userId">;
export type DomainUser_DETAILED = RequireFields<
  DomainUser_SHORT,
  "currentLocale" | "createdAt" | "user"
>;
export type DomainUserSearchRq = components["schemas"]["DomainUserSearchRqV1"];

export type DomainUserFilterKeys =
  | "userIdList"
  | "nameLikeList"
  | "emailLikeList"
  | "businessAccountIdList";

export type DomainUserFilters = Partial<
  Pick<DomainUserSearchRq, DomainUserFilterKeys>
>;

export type DomainUserViewQuery =
  operations["domainUserViewV1"]["parameters"]["query"];

export type UserPermissionListQuery =
  operations["userPermissionListV1"]["parameters"]["query"];
