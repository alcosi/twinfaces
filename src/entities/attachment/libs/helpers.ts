import { Attachment, Attachment_DETAILED } from "@/entities/attachment";
import { RelatedObjects } from "@/shared/api";

export const hydrateAttachmentFromMap = (
  dto: Attachment,
  relatedObjects?: RelatedObjects
): Attachment_DETAILED => {
  const hydrated: Attachment_DETAILED = Object.assign(
    {},
    dto
  ) as Attachment_DETAILED;

  if (dto.twinId && relatedObjects?.twinMap) {
    hydrated.twin = relatedObjects.twinMap[dto.twinId]!;
  }

  if (dto.twinClassFieldId && relatedObjects?.twinClassFieldMap) {
    hydrated.twinClassField =
      relatedObjects.twinClassFieldMap[dto.twinClassFieldId]!;
  }

  if (dto.twinflowTransitionId && relatedObjects?.transitionsMap) {
    hydrated.twinflowTransition =
      relatedObjects.transitionsMap[dto.twinflowTransitionId]!;
  }

  if (dto.commentId && relatedObjects?.commentMap) {
    hydrated.comment = relatedObjects.commentMap[dto.commentId]!;
  }

  if (dto.viewPermissionId && relatedObjects?.permissionMap) {
    hydrated.viewPermission =
      relatedObjects.permissionMap[dto.viewPermissionId]!;
  }

  if (dto.authorUserId && relatedObjects?.userMap) {
    hydrated.authorUser = relatedObjects.userMap[dto.authorUserId]!;
  }

  return hydrated;
};
