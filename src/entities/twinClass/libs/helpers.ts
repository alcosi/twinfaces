import { RelatedObjects } from "@/shared/api";
import { TwinClass } from "../api";
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

  return twinClass;
};
