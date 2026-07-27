import { Link } from "@/entities/link";
import type { Twin } from "@/entities/twin/server";
import { RelatedObjects } from "@/shared/api";

import { TwinLink, TwinLink_DETAILED } from "../api/types";

export function hydrateTwinLinkFromMap(
  dto: TwinLink,
  relatedObjects?: RelatedObjects
): TwinLink_DETAILED {
  const hydrated: TwinLink_DETAILED = Object.assign(
    {},
    dto
  ) as TwinLink_DETAILED;

  if (dto.linkId && relatedObjects?.linkMap) {
    hydrated.link = relatedObjects.linkMap[dto.linkId] as Link;
  }

  if (dto.srcTwinId && relatedObjects?.twinMap) {
    hydrated.srcTwin = relatedObjects.twinMap[dto.srcTwinId] as Twin;
  }

  if (dto.dstTwinId && relatedObjects?.twinMap) {
    hydrated.dstTwin = relatedObjects.twinMap[dto.dstTwinId] as Twin;
  }

  if (dto.createdByUserId && relatedObjects?.userMap) {
    hydrated.createdByUser = relatedObjects.userMap[dto.createdByUserId];
  }

  return hydrated;
}
