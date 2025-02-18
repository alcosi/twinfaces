import { RelatedObjects } from "@/shared/api";
import { Link, Link_MANAGED } from "../api";

export function hydrateLinkFromMap(
  dto: Link,
  relatedObjects?: RelatedObjects
): Link_MANAGED {
  const hydrated: Link_MANAGED = Object.assign({}, dto) as Link_MANAGED;

  if (dto.srcTwinClassId && relatedObjects?.twinClassMap) {
    hydrated.srcTwinClass = relatedObjects.twinClassMap[dto.srcTwinClassId];
  }

  if (dto.dstTwinClassId && relatedObjects?.twinClassMap) {
    hydrated.dstTwinClass = relatedObjects.twinClassMap[dto.dstTwinClassId];
  }

  if (dto.createdByUserId && relatedObjects?.userMap) {
    hydrated.createdByUser = relatedObjects.userMap[dto.createdByUserId];
  }

  return hydrated;
}
