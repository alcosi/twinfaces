import type { Factory } from "@/entities/factory";
import type { FactoryConditionSet } from "@/entities/factory-condition-set";
import {
  FactoryPipeline,
  FactoryPipeline_DETAILED,
} from "@/entities/factory-pipeline";
import type { TwinClass_DETAILED } from "@/entities/twin-class";
import type { TwinStatus } from "@/entities/twin-status";
import { RelatedObjects } from "@/shared/api";

export const hydrateFactoryPipelineFromMap = (
  dto: FactoryPipeline,
  relatedObjects?: RelatedObjects
): FactoryPipeline_DETAILED => {
  const hydrated: FactoryPipeline_DETAILED = Object.assign(
    {},
    dto
  ) as FactoryPipeline_DETAILED;

  if (dto.inputTwinClassId && relatedObjects?.twinClassMap) {
    hydrated.inputTwinClass = relatedObjects.twinClassMap[
      dto.inputTwinClassId
    ] as TwinClass_DETAILED;
  }

  if (dto.factoryId && relatedObjects?.factoryMap) {
    hydrated.factory = relatedObjects.factoryMap[dto.factoryId] as Factory;
  }

  if (dto.nextFactoryId && relatedObjects?.factoryMap) {
    hydrated.nextFactory = relatedObjects.factoryMap[
      dto.nextFactoryId
    ] as Factory;
  }

  if (dto.outputTwinStatusId && relatedObjects?.statusMap) {
    hydrated.outputTwinStatus = relatedObjects.statusMap[
      dto.outputTwinStatusId
    ] as TwinStatus;
  }

  if (dto.factoryConditionSetId && relatedObjects?.factoryConditionSetMap) {
    hydrated.factoryConditionSet = relatedObjects.factoryConditionSetMap[
      dto.factoryConditionSetId
    ] as FactoryConditionSet;
  }

  return hydrated;
};
