import { DataListOptionV3 } from "@/entities/datalist-option";
import { Twin, TwinTagManageV1 } from "@/entities/twin/server";
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
