import { RelatedObjects } from "@/shared/api";

import {
  FactoryMultiplierFilter,
  FactoryMultiplierFilter_DETAILED,
} from "../api";

export const hydrateFactoryMultiplierFilterFromMap = (
  dto: FactoryMultiplierFilter,
  relatedObjects?: RelatedObjects
): FactoryMultiplierFilter_DETAILED => {
  const hydrated: FactoryMultiplierFilter_DETAILED = Object.assign(
    {},
    dto
  ) as FactoryMultiplierFilter_DETAILED;

  if (dto.multiplier?.factoryId && relatedObjects?.factoryMap) {
    hydrated.multiplier.factory =
      relatedObjects.factoryMap[dto.multiplier.factoryId];
  }

  if (dto.inputTwinClassId && relatedObjects?.twinClassMap) {
    hydrated.inputTwinClass =
      relatedObjects.twinClassMap[dto.inputTwinClassId]!;
  }

  return hydrated;
};
