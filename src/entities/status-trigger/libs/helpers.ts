import { TwinStatus } from "@/entities/twin-status";
import { TwinTrigger_DETAILED } from "@/entities/twin-trigger";
import { RelatedObjects } from "@/shared/api";

import { StatusTrigger, StatusTrigger_DETAILED } from "../api/types";

export const hydrateStatusTriggerFromMap = (
  dto: StatusTrigger,
  relatedObjects?: RelatedObjects
): StatusTrigger_DETAILED => {
  const hydrated: StatusTrigger_DETAILED = Object.assign(
    {},
    dto
  ) as StatusTrigger_DETAILED;

  if (dto.twinStatusId && relatedObjects?.statusMap) {
    hydrated.twinStatus = relatedObjects.statusMap[
      dto.twinStatusId
    ] as TwinStatus;
  }

  if (dto.twinTriggerId && relatedObjects?.triggerMap) {
    hydrated.twinTrigger = relatedObjects.triggerMap[
      dto.twinTriggerId
    ] as TwinTrigger_DETAILED;
  }

  return hydrated;
};
