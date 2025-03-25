import { User } from "@/entities/user";
import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type Comment = components["schemas"]["CommentV1"];
export type Comment_DETAILED = RequireFields<
  Comment,
  "id" | "text" | "authorUserId"
> & { authorUser: User };

export type CommentFilterKeys = "idList";
export type CommentFilters = Partial<Pick<any, CommentFilterKeys>>;
