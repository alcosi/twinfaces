import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type Comment = components["schemas"]["CommentBaseDTOv2"];
export type Comment_DETAILED = RequireFields<
  Comment,
  "id" | "text" | "authorUserId" | "authorUser"
>;

export type CommentFilterKeys = "idList";
export type CommentFilters = Partial<Pick<any, CommentFilterKeys>>;
export type CommentView = components["schemas"]["CommentViewV1"];
