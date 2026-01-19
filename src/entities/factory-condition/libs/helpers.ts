import { extendFeaturerParams } from "@/entities/featurer";
import { RelatedObjects } from "@/shared/api";

import { FactoryCondition, FactoryCondition_DETAILED } from "../api";

export const hydrateFactoryConditionFromMap = (
  dto: FactoryCondition,
  relatedObjects?: RelatedObjects
): FactoryCondition_DETAILED => {
  const hydrated: FactoryCondition_DETAILED = Object.assign(
    {},
    dto
  ) as FactoryCondition_DETAILED;

  if (dto.factoryConditionSetId && relatedObjects?.factoryConditionSetMap) {
    hydrated.factoryConditionSet =
      relatedObjects.factoryConditionSetMap[dto.factoryConditionSetId]!;
  }

  if (dto.conditionerFeaturerId && relatedObjects?.featurerMap) {
    hydrated.conditionerFeaturer =
      relatedObjects.featurerMap[dto.conditionerFeaturerId]!;
  }

  if (hydrated.conditionerParams && hydrated.conditionerFeaturer?.params) {
    hydrated.conditionerDetailedParams = extendFeaturerParams(
      hydrated.conditionerParams,
      hydrated.conditionerFeaturer?.params
    );
  }

  return hydrated;
};
