import { RelatedObjects } from "@/shared/api";
import { DataListsMap, TwinClass } from "../api";
import { TwinClass_DETAILED } from "./types";

export const hydrateTwinClassFromMap = (
  twinClassDTO: TwinClass,
  relatedObjects?: RelatedObjects
): TwinClass_DETAILED => {
  const twinClass: TwinClass_DETAILED = Object.assign(
    {},
    twinClassDTO
  ) as TwinClass_DETAILED;

  if (!relatedObjects?.twinClassMap) return twinClass;

  if (twinClassDTO.headClassId) {
    twinClass.headClass = relatedObjects.twinClassMap[twinClassDTO.headClassId];
  }

  if (twinClassDTO.extendsClassId) {
    twinClass.extendsClass =
      relatedObjects.twinClassMap[twinClassDTO.extendsClassId];
  }

  if (twinClassDTO.markersDataListId && relatedObjects.dataListsMap) {
    twinClass.markerMap = relatedObjects.dataListsMap[
      twinClassDTO.markersDataListId
    ] as DataListsMap;
    // twinClass.markerList = twinClass.markerMap?.optionIdList as string[];
  }

  if (twinClassDTO.tagsDataListId && relatedObjects.dataListsMap) {
    twinClass.tagMap = relatedObjects.dataListsMap[
      twinClassDTO.tagsDataListId
    ] as DataListsMap;
  }

  return twinClass;
};
