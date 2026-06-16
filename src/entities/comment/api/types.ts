import { Twin } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type Comment = components["schemas"]["CommentV1"];
export type Comment_DETAILED = RequireFields<
  Comment,
  "id" | "text" | "authorUserId"
> & {
  authorUser: User;
  twin?: Twin;
};

export type CommentSearchRqV2 = components["schemas"]["CommentSearchRqV2"];

/** Server-supported sort fields for `/private/comment/search/v2`. */
export type CommentSortField = NonNullable<CommentSearchRqV2["sortField"]>;

export type CommentCountRqV1 = components["schemas"]["CommentCountRqV1"];

/** Server-supported group-by fields for `/private/comment/count/v1`. */
export type CommentCountGroupField = NonNullable<
  CommentCountRqV1["groupFields"]
>[number];

export type CommentCount = components["schemas"]["CommentCountV1"];

export type CommentFilterKeys =
  | "idList"
  | "twinIdList"
  | "createdByUserIdList"
  | "textLikeList"
  | "createdAt";

export type CommentFilters = Partial<
  Pick<components["schemas"]["CommentSearchV1"], CommentFilterKeys>
>;
