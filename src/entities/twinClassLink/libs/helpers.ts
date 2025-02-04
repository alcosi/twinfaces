import { TwinClass } from "@/entities/twinClass/api";
import { RelatedObjects } from "@/shared/api";
import { TwinClassLink, TwinClassLink_MANAGED } from "../api";

export function hydrateLinkFromMap(
  dto: TwinClassLink,
  relatedObjects?: RelatedObjects
): TwinClassLink_MANAGED {
  const hydrated: TwinClassLink_MANAGED = Object.assign(
    {},
    dto
  ) as TwinClassLink_MANAGED;

  if (!relatedObjects?.twinClassMap) return hydrated;

  if (dto.srcTwinClassId) {
    hydrated.srcTwinClass = relatedObjects.twinClassMap[
      dto.srcTwinClassId
    ] as TwinClass;
  }

  if (dto.dstTwinClassId) {
    hydrated.dstTwinClass = relatedObjects.twinClassMap[
      dto.dstTwinClassId
    ] as TwinClass;
  }

  return hydrated;
}
