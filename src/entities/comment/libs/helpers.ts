import { RelatedObjects } from "@/shared/api";
import {
  Comment,
  Comment_DETAILED,
  CommentView,
  CommentView_DETAILED,
} from "../api";

export const hydrateCommentFromMap = (
  dto: Comment,
  relatedObjects?: RelatedObjects
): Comment_DETAILED => {
  const hydrated: Comment_DETAILED = Object.assign({}, dto) as Comment_DETAILED;

  // TODO: Add hydration logic here

  return hydrated;
};

export const hydrateCommentViewFromMap = (
  dto: CommentView,
  relatedObjects?: RelatedObjects
): CommentView_DETAILED => {
  const hydrated: CommentView_DETAILED = Object.assign(
    {},
    dto
  ) as CommentView_DETAILED;

  // TODO: Add hydration logic here

  return hydrated;
};
