import { Comment_DETAILED } from "@/entities/comment";
import { Permission } from "@/entities/permission";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { TwinFlowTransition_DETAILED } from "@/entities/twin-flow-transition";
import { Twin } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { RelatedObjects } from "@/shared/api";

import { Attachment, Attachment_DETAILED } from "../api";

export const hydrateAttachmentFromMap = (
  dto: Attachment,
  relatedObjects?: RelatedObjects
): Attachment_DETAILED => {
  const hydrated: Attachment_DETAILED = Object.assign(
    {},
    dto
  ) as Attachment_DETAILED;

  if (dto.twinId && relatedObjects?.twinMap) {
    hydrated.twin = relatedObjects.twinMap[dto.twinId] as Twin;
  }

  if (dto.twinClassFieldId && relatedObjects?.twinClassFieldMap) {
    hydrated.twinClassField = relatedObjects.twinClassFieldMap[
      dto.twinClassFieldId
    ] as TwinClassField_DETAILED;
  }

  if (dto.twinflowTransitionId && relatedObjects?.transitionsMap) {
    hydrated.twinflowTransition = relatedObjects.transitionsMap[
      dto.twinflowTransitionId
    ] as TwinFlowTransition_DETAILED;
  }

  if (dto.commentId && relatedObjects?.commentMap) {
    hydrated.comment = relatedObjects.commentMap[
      dto.commentId
    ] as Comment_DETAILED;
  }

  if (dto.viewPermissionId && relatedObjects?.permissionMap) {
    hydrated.viewPermission = relatedObjects.permissionMap[
      dto.viewPermissionId
    ] as Permission;
  }

  if (dto.authorUserId && relatedObjects?.userMap) {
    hydrated.authorUser = relatedObjects.userMap[dto.authorUserId] as User;
  }

  return hydrated;
};
