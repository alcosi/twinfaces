import { RelatedObjects } from "@/shared/api";
import {
  FactoryPipeline,
  FactoryPipeline_DETAILED,
} from "@/entities/factoryPipeline";
import { TwinClass_DETAILED } from "@/entities/twinClass";
import { Factory } from "@/entities/factory";

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
    ] as TwinClass_DETAILED;
  }

  return hydrated;
};
