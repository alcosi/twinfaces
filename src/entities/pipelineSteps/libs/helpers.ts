import { RelatedObjects } from "@/shared/api";
import { PipelineStep, PipelineStep_DETAILED } from "../api";
import { FactoryPipeline } from "../../factoryPipeline";

export const hydratePipelineStepFromMap = (
  dto: PipelineStep,
  relatedObjects?: RelatedObjects
): PipelineStep_DETAILED => {
  const hydrated: PipelineStep_DETAILED = Object.assign(
    {},
    dto
  ) as PipelineStep_DETAILED;

  if (!relatedObjects?.factoryPipelineMap) return hydrated;

  if (dto.factoryPipelineId) {
    hydrated.factoryPipeline = relatedObjects.factoryPipelineMap[
      hydrated.factoryPipelineId
    ] as FactoryPipeline;
  }

  return hydrated;
};
