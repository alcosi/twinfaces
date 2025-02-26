import { RelatedObjects } from "@/shared/api";

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
    hydrated.inputTwinClass =
      relatedObjects.twinClassMap[dto.inputTwinClassId]!;
  }

  if (dto.multiplierFeaturerId && relatedObjects?.featurerMap) {
    hydrated.multiplierFeaturer =
      relatedObjects.featurerMap[dto.multiplierFeaturerId]!;
  }

  return hydrated;
};
