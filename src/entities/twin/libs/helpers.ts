import { DataListOptionV1, DataListOptionV3 } from "@/entities/datalist-option";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinStatus } from "@/entities/twin-status";
import { RelatedObjects } from "@/shared/api";
import {
  isFalsy,
  isObject,
  isPopulatedArray,
  isPopulatedString,
} from "@/shared/libs";
import { User } from "../../user";
import { Twin, Twin_DETAILED, TwinTagManageV1 } from "../api";

export const hydrateTwinFromMap = (
  dto: Twin,
  relatedObjects?: RelatedObjects
): Twin_DETAILED => {
  const hydrated: Twin_DETAILED = Object.assign({}, dto) as Twin_DETAILED;

  if (!relatedObjects?.twinClassMap) return hydrated;

  if (dto.statusId && relatedObjects.statusMap) {
    hydrated.status = relatedObjects.statusMap[dto.statusId] as TwinStatus;
  }

  if (dto.twinClassId) {
    hydrated.twinClass = relatedObjects.twinClassMap[
      dto.twinClassId
    ] as TwinClass_DETAILED;
  }

  if (dto.authorUserId && relatedObjects.userMap) {
    hydrated.authorUser = relatedObjects.userMap[dto.authorUserId] as User;
  }

  if (dto.assignerUserId && relatedObjects.userMap) {
    hydrated.assignerUser = relatedObjects.userMap[dto.assignerUserId] as User;
  }

  if (dto.headTwinId && relatedObjects.twinMap) {
    hydrated.headTwin = relatedObjects.twinMap[dto.headTwinId];
  }

  if (dto.tagIdList && relatedObjects.dataListsOptionMap) {
    hydrated.tags = dto.tagIdList.map<DataListOptionV1>(
      (id) => relatedObjects.dataListsOptionMap![id]!
    );
  }

  return hydrated;
};

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
