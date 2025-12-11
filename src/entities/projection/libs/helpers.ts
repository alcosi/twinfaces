import { RelatedObjects } from "@/shared/api";

import { Projection, Projection_DETAILED } from "../api";

export const hydrateProjectionFromMap = (
  dto: Projection,
  relatedObjects?: RelatedObjects
): Projection_DETAILED => {
  const hydrated: Projection_DETAILED = Object.assign(
    {},
    dto
  ) as Projection_DETAILED;

  if (dto.projectionTypeId && relatedObjects?.projectionTypeMap) {
    hydrated.projectionType =
      relatedObjects.projectionTypeMap[dto.projectionTypeId];
  }

  return hydrated;
};
