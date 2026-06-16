import { RelatedObjects } from "@/shared/api";

import { Comment, Comment_DETAILED } from "../api";

export const hydrateCommentFromMap = (
  dto: Comment,
  relatedObjects?: RelatedObjects
): Comment_DETAILED => {
  const hydrated: Comment_DETAILED = Object.assign({}, dto) as Comment_DETAILED;

  if (dto.authorUserId && relatedObjects?.userMap) {
    hydrated.authorUser = relatedObjects.userMap[dto.authorUserId]!;
  }

  if (dto.twinId && relatedObjects?.twinMap) {
    hydrated.twin = relatedObjects.twinMap[dto.twinId]!;
  }

  return hydrated;
};
