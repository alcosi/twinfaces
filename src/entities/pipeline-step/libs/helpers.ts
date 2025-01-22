import { RelatedObjects } from "@/shared/api";
import { PipelineStep, PipelineStep_DETAILED } from "../api";
import { FactoryPipeline } from "../../factory-pipeline";
// import { FactoryPipeline } from "../../factoryPipeline";

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

  return hydrated;
};
