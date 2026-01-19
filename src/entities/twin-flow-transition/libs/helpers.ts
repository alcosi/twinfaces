import type { Factory } from "@/entities/factory";
import { Featurer_DETAILED, extendFeaturerParams } from "@/entities/featurer";
import type { Permission } from "@/entities/permission";
import type { TwinClass_DETAILED } from "@/entities/twin-class";
import type { TwinFlow } from "@/entities/twin-flow";
import type { TwinStatus } from "@/entities/twin-status";
import type { User } from "@/entities/user";
import { RelatedObjects } from "@/shared/api";

import {
  TwinFlowTransition,
  TwinFlowTransitionTrigger,
  TwinFlowTransitionTrigger_DETAILED,
  TwinFlowTransition_DETAILED,
} from "../api";

export const hydrateTwinFlowTransitionFromMap = (
  dto: TwinFlowTransition,
  relatedObjects?: RelatedObjects
): TwinFlowTransition_DETAILED => {
  const hydrated: TwinFlowTransition_DETAILED = Object.assign(
    {},
    dto
  ) as TwinFlowTransition_DETAILED;
  if (dto.srcTwinStatusId && relatedObjects?.statusMap) {
    hydrated.srcTwinStatus = relatedObjects.statusMap[
      dto.srcTwinStatusId
    ] as TwinStatus;
  }

  if (dto.dstTwinStatusId && relatedObjects?.statusMap) {
    hydrated.dstTwinStatus = relatedObjects.statusMap[
      dto.dstTwinStatusId
    ] as TwinStatus;
  }

  if (dto.permissionId && relatedObjects?.permissionMap) {
    hydrated.permission = relatedObjects.permissionMap[
      dto.permissionId
    ] as Permission;
  }

  if (dto.createdByUserId && relatedObjects?.userMap) {
    hydrated.createdByUser = relatedObjects.userMap[
      dto.createdByUserId
    ] as User;
  }

  if (dto.twinflowId && relatedObjects?.twinflowMap) {
    hydrated.twinflow = relatedObjects.twinflowMap[dto.twinflowId] as TwinFlow;
  }

  if (dto.inbuiltTwinFactoryId && relatedObjects?.factoryMap) {
    hydrated.inbuiltTwinFactory = relatedObjects.factoryMap[
      dto.inbuiltTwinFactoryId
    ] as Factory;
  }

  if (
    hydrated.twinflow?.twinClassId &&
    relatedObjects?.twinClassMap &&
    hydrated.twinflow
  ) {
    hydrated.twinflow.twinClass = relatedObjects.twinClassMap[
      hydrated.twinflow.twinClassId
    ] as TwinClass_DETAILED;
  }

  return hydrated;
};

export const hydrateTwinFlowTransitionTriggerFromMap = (
  dto: TwinFlowTransitionTrigger,
  relatedObjects?: RelatedObjects
): TwinFlowTransitionTrigger_DETAILED => {
  const hydrated: TwinFlowTransitionTrigger_DETAILED = Object.assign(
    {},
    dto
  ) as TwinFlowTransition_DETAILED;

  if (dto.twinflowTransitionId && relatedObjects?.transitionsMap) {
    hydrated.twinflowTransition = relatedObjects.transitionsMap[
      dto.twinflowTransitionId
    ] as TwinFlowTransition_DETAILED;
  }

  if (dto.transitionTriggerFeaturerId && relatedObjects?.featurerMap) {
    hydrated.triggerFeaturer = relatedObjects.featurerMap[
      dto.transitionTriggerFeaturerId
    ] as Featurer_DETAILED;
  }

  if (hydrated.transitionTriggerParams && hydrated.triggerFeaturer?.params) {
    hydrated.transitionTriggerDetailedParams = extendFeaturerParams(
      hydrated.transitionTriggerParams,
      hydrated.triggerFeaturer.params
    );
  }

  return hydrated;
};
