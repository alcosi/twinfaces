import { RelatedObjects } from "@/shared/api";

import { TwinFlowTransition, TwinFlowTransition_DETAILED } from "../api";

export const hydrateTwinFlowTransitionFromMap = (
  dto: TwinFlowTransition,
  relatedObjects?: RelatedObjects
): TwinFlowTransition_DETAILED => {
  const hydrated: TwinFlowTransition_DETAILED = Object.assign(
    {},
    dto
  ) as TwinFlowTransition_DETAILED;
  if (dto.srcTwinStatusId && relatedObjects?.statusMap) {
    hydrated.srcTwinStatus = relatedObjects.statusMap[dto.srcTwinStatusId];
  }

  if (dto.dstTwinStatusId && relatedObjects?.statusMap) {
    hydrated.dstTwinStatus = relatedObjects.statusMap[dto.dstTwinStatusId];
  }

  if (dto.permissionId && relatedObjects?.permissionMap) {
    hydrated.permission = relatedObjects.permissionMap[dto.permissionId];
  }

  if (dto.createdByUserId && relatedObjects?.userMap) {
    hydrated.createdByUser = relatedObjects.userMap[dto.createdByUserId];
  }

  if (dto.twinflowId && relatedObjects?.twinflowMap) {
    hydrated.twinflow = relatedObjects.twinflowMap[dto.twinflowId];
  }

  if (dto.inbuiltTwinFactoryId && relatedObjects?.factoryMap) {
    hydrated.inbuiltTwinFactory =
      relatedObjects.factoryMap[dto.inbuiltTwinFactoryId];
  }

  if (dto.twinflowId && relatedObjects?.twinClassMap && hydrated.twinflow) {
    hydrated.twinflow.twinClass =
      relatedObjects.twinClassMap[hydrated.twinflow.twinClassId!];
  }

  return hydrated;
};
