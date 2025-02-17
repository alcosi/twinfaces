import { RelatedObjects } from "@/shared/api";
import { TwinFlowTransition, TwinFlowTransition_DETAILED } from "../api";

export const hydrateTwinFlowTransitionFromMap = (
  transitionDTO: TwinFlowTransition,
  relatedObjects?: RelatedObjects
): TwinFlowTransition_DETAILED => {
  const transition: TwinFlowTransition_DETAILED = Object.assign(
    {},
    transitionDTO
  ) as TwinFlowTransition_DETAILED;
  if (transitionDTO.srcTwinStatusId && relatedObjects?.statusMap) {
    transition.srcTwinStatus =
      relatedObjects.statusMap[transitionDTO.srcTwinStatusId];
  }

  if (transitionDTO.dstTwinStatusId && relatedObjects?.statusMap) {
    transition.dstTwinStatus =
      relatedObjects.statusMap[transitionDTO.dstTwinStatusId];
  }

  if (transitionDTO.permissionId && relatedObjects?.permissionMap) {
    transition.permission =
      relatedObjects.permissionMap[transitionDTO.permissionId];
  }

  if (transitionDTO.createdByUserId && relatedObjects?.userMap) {
    transition.createdByUser =
      relatedObjects.userMap[transitionDTO.createdByUserId];
  }

  return transition;
};
