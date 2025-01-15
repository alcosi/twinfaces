import {RelatedObjects} from "@/shared/api";
import {FactoryPipeline, FactoryPipeline_DETAILED} from "@/entities/factoryPipeline";

export const hydrateFactoryPipelineFromMap = (
  dto: FactoryPipeline,
  relatedObjects?: RelatedObjects
): FactoryPipeline_DETAILED => {
  const hydrated: FactoryPipeline_DETAILED = Object.assign(
    {},
      dto
  ) as FactoryPipeline_DETAILED;
  if (dto.inputTwinClassId && relatedObjects?.twinClassMap) {
    dto.inputTwinClass = relatedObjects.twinClassMap[dto.inputTwinClassId]
  }

  if (dto.factoryId && relatedObjects?.factoryMap) {
    dto.factory = relatedObjects.factoryMap[dto.factoryId]
  }

  console.log(dto, relatedObjects,hydrated )

  return hydrated;
};
