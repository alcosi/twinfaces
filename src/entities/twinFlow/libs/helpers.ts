import { RelatedObjects } from "@/shared/api";
import { TwinFlow, TwinFlow_DETAILED } from "../api";

export const hydrateTwinFlowFromMap = (
  dto: TwinFlow,
  relatedObjects?: RelatedObjects
): TwinFlow_DETAILED => {
  const hydrated: TwinFlow_DETAILED = Object.assign(
    {},
    dto
  ) as TwinFlow_DETAILED;

  if (dto.initialStatusId && relatedObjects?.statusMap) {
    hydrated.initialStatus = relatedObjects.statusMap[dto.initialStatusId];
  }

  if (dto.createdByUserId && relatedObjects?.userMap) {
    hydrated.createdByUser = relatedObjects.userMap[dto.createdByUserId];
  }

  return hydrated;
};
