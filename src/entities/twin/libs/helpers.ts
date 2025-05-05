import { Comment_DETAILED } from "@/entities/comment";
import { DataListOptionV3 } from "@/entities/datalist-option";
import { Permission } from "@/entities/permission";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { TwinFlowTransition_DETAILED } from "@/entities/twin-flow-transition";
import {
  Attachment,
  Attachment_DETAILED,
  Twin,
  TwinTagManageV1,
} from "@/entities/twin/server";
import { User } from "@/entities/user";
import { RelatedObjects } from "@/shared/api";
import {
  isFalsy,
  isObject,
  isPopulatedArray,
  isPopulatedString,
  isTruthy,
} from "@/shared/libs";

export function formatTwinDisplay({ aliases, name }: Twin): string {
  const aliasText = isPopulatedArray(aliases) ? `${aliases[0]} | ` : "";
  const twinName = isPopulatedString(name) ? `${name}` : "N/A";
  return `${aliasText}${twinName}`;
}

export function categorizeTwinTags(
  nextTags: (string | DataListOptionV3)[],
  prevTags: DataListOptionV3[]
): TwinTagManageV1 {
  const existingTags: string[] = [];
  const newTags: string[] = [];
  nextTags.forEach((tag) => {
    if (isObject<DataListOptionV3>(tag) && isPopulatedString(tag.id)) {
      existingTags.push(tag.id);
    } else if (isPopulatedString(tag)) {
      newTags.push(tag);
    }
  });

  const deleteTags = prevTags.reduce((tags, tag) => {
    const isStillPresent = nextTags.some(
      (inputTag) =>
        isObject<DataListOptionV3>(inputTag) &&
        isPopulatedString(inputTag.id) &&
        inputTag.id === tag.id
    );
    if (isFalsy(isStillPresent) && isPopulatedString(tag.id)) {
      tags.push(tag.id);
    }
    return tags;
  }, [] as string[]);

  return {
    existingTags,
    newTags,
    deleteTags,
  };
}

export function transformToTwinTags(
  arr: Array<{ id?: string; name: string } | string>
) {
  return arr.reduce<{
    existingTags: string[];
    newTags: string[];
  }>(
    (acc, tag) => {
      if (isPopulatedString(tag)) {
        acc.newTags.push(tag);
      } else if (isTruthy(tag.id)) {
        acc.existingTags.push(tag.id);
      }

      return acc;
    },
    { existingTags: [], newTags: [] }
  );
}

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
