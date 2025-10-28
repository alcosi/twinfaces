import { TwinClass_DETAILED } from "@/entities/twin-class";
import { RelatedObjects } from "@/shared/api";

import { TwinStatus, TwinStatus_DETAILED } from "../api";

export const hydrateTwinStatusFromMap = (
  dto: TwinStatus,
  relatedObjects?: RelatedObjects
): TwinStatus_DETAILED => {
  const hydrated: TwinStatus_DETAILED = Object.assign(
    {},
    dto
  ) as TwinStatus_DETAILED;

  if (dto.twinClassId && relatedObjects?.twinClassMap) {
    hydrated.twinClass = relatedObjects.twinClassMap[
      dto.twinClassId
    ] as TwinClass_DETAILED;
  }

  return hydrated;
};
