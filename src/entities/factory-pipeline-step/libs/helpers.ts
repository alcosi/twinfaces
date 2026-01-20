import { FactoryConditionSet } from "@/entities/factory-condition-set";
import { FactoryPipeline } from "@/entities/factory-pipeline";
import { RelatedObjects } from "@/shared/api";

import { extendFeaturerParams } from "../../../features/featurer/utils/helpers";
import { PipelineStep, PipelineStep_DETAILED } from "../api";

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
    hydrated.fillerFeaturer =
      relatedObjects.featurerMap[hydrated.fillerFeaturerId]!;
  }

  if (
    hydrated.factoryConditionSetId &&
    relatedObjects?.factoryConditionSetMap
  ) {
    hydrated.factoryConditionSet = relatedObjects.factoryConditionSetMap[
      hydrated.factoryConditionSetId
    ] as FactoryConditionSet;
  }

  if (hydrated.fillerParams && hydrated.fillerFeaturer?.params) {
    hydrated.fillerDetailedParams = extendFeaturerParams(
      hydrated.fillerParams,
      hydrated.fillerFeaturer.params
    );
  }

  return hydrated;
};
