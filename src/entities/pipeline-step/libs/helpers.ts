import { RelatedObjects } from "@/shared/api";
import { PipelineStep, PipelineStep_DETAILED } from "../api";
import { FactoryPipeline } from "@/entities/factory-pipeline";

export const hydratePipelineStepFromMap = (
  dto: PipelineStep,
  relatedObjects?: RelatedObjects
): PipelineStep_DETAILED => {
  const hydrated: PipelineStep_DETAILED = Object.assign(
    {},
    dto
  ) as PipelineStep_DETAILED;

  if (dto.factoryPipelineId && relatedObjects?.factoryPipelineMap) {
    hydrated.factoryPipeline = relatedObjects.factoryPipelineMap[
      dto.factoryPipelineId
    ] as FactoryPipeline;
  }

  if (hydrated.factoryPipeline?.factoryId && relatedObjects?.factoryMap) {
    hydrated.factoryPipeline.factory =
      relatedObjects.factoryMap[hydrated.factoryPipeline.factoryId];
  }

  if (hydrated.fillerFeaturerId && relatedObjects?.featurerMap) {
    hydrated.fillerFeaturer = relatedObjects.featurerMap[hydrated.fillerFeaturerId]!;
  }

  return hydrated;
};
