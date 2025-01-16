import { RelatedObjects } from "@/shared/api";
import { PipelineSteps, PipelineSteps_DETAILED } from "../api";
import { FactoryPipeline } from "../../factoryPipeline";

export const hydratePipelineStepsFromMap = (
  pipelineStepsDTO: PipelineSteps,
  relatedObjects?: RelatedObjects
): PipelineSteps_DETAILED => {
  const pipelineSteps: PipelineSteps_DETAILED = Object.assign(
    {},
    pipelineStepsDTO
  ) as PipelineSteps_DETAILED;

  if (!relatedObjects?.factoryPipelineMap) return pipelineSteps;

  if (pipelineStepsDTO.factoryPipelineId) {
    pipelineSteps.factoryPipeline = relatedObjects.factoryPipelineMap[
      pipelineStepsDTO.factoryPipelineId
    ] as FactoryPipeline;
  }

  console.log(pipelineSteps)
  return pipelineSteps;
};
