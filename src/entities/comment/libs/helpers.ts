import { RelatedObjects } from "@/shared/api";
import { Comment, Comment_DETAILED } from "../api";

export const hydrateCommentFromMap = (
  commentDTO: Comment,
  relatedObjects?: RelatedObjects
): Comment_DETAILED => {
  const comment: Comment_DETAILED = Object.assign(
    {},
    commentDTO
  ) as Comment_DETAILED;

  // TODO: Add hydration logic here

  return comment;
};
