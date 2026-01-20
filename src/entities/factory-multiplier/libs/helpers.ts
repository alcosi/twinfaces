import { TwinClass_DETAILED } from "@/entities/twin-class";
import { RelatedObjects } from "@/shared/api";

import { extendFeaturerParams } from "../../../features/featurer/utils/helpers";
import { FactoryMultiplier, FactoryMultiplier_DETAILED } from "../api";

export const hydrateFactoryMultiplierFromMap = (
  dto: FactoryMultiplier,
  relatedObjects?: RelatedObjects
): FactoryMultiplier_DETAILED => {
  const hydrated: FactoryMultiplier_DETAILED = Object.assign(
    {},
    dto
  ) as FactoryMultiplier_DETAILED;

  if (dto.factoryId && relatedObjects?.factoryMap) {
    hydrated.factory = relatedObjects.factoryMap[dto.factoryId]!;
  }

  if (dto.inputTwinClassId && relatedObjects?.twinClassMap) {
    hydrated.inputTwinClass = relatedObjects.twinClassMap[
      dto.inputTwinClassId
    ] as TwinClass_DETAILED;
  }

  if (dto.multiplierFeaturerId && relatedObjects?.featurerMap) {
    hydrated.multiplierFeaturer =
      relatedObjects.featurerMap[dto.multiplierFeaturerId]!;
  }

  if (hydrated.multiplierParams && hydrated.multiplierFeaturer?.params) {
    hydrated.multiplierDetailedParams = extendFeaturerParams(
      hydrated.multiplierParams,
      hydrated.multiplierFeaturer.params
    );
  }

  return hydrated;
};
