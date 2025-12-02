import { FactoryConditionSet } from "@/entities/factory-condition-set";
import { FactoryMultiplier } from "@/entities/factory-multiplier/api";
import { TwinClass_DETAILED } from "@/entities/twin-class";
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

  if (dto.multiplierId && relatedObjects?.factoryMultiplierMap) {
    hydrated.multiplier = relatedObjects.factoryMultiplierMap[
      dto.multiplierId
    ] as FactoryMultiplier;
  }

  if (dto.factoryConditionSetId && relatedObjects?.factoryConditionSetMap) {
    hydrated.factoryConditionSet = relatedObjects.factoryConditionSetMap[
      dto.factoryConditionSetId
    ] as FactoryConditionSet;
  }

  if (
    dto.multiplier?.factoryId &&
    hydrated.multiplier &&
    relatedObjects?.factoryMap
  ) {
    hydrated.multiplier.factory =
      relatedObjects.factoryMap[dto.multiplier.factoryId];
  }

  if (dto.inputTwinClassId && relatedObjects?.twinClassMap) {
    hydrated.inputTwinClass = relatedObjects.twinClassMap[
      dto.inputTwinClassId
    ] as TwinClass_DETAILED;
  }

  return hydrated;
};
