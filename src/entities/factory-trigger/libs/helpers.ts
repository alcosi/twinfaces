import {
  FactoryTrigger,
  FactoryTrigger_DETAILED,
} from "@/entities/factory-trigger";
import { Factory_DETAILED } from "@/entities/factory/api";
import type { TwinClass_DETAILED } from "@/entities/twin-class";
import { RelatedObjects } from "@/shared/api";

export function hydrateFactoryTriggerFromMap(
  dto: FactoryTrigger,
  relatedObjects?: RelatedObjects
): FactoryTrigger_DETAILED {
  const hydrated: FactoryTrigger_DETAILED = Object.assign(
    {},
    dto
  ) as FactoryTrigger_DETAILED;

  if (dto.twinFactoryId && relatedObjects?.factoryMap) {
    hydrated.factory = relatedObjects.factoryMap[
      dto.twinFactoryId
    ] as Factory_DETAILED;
  }

  if (dto.inputTwinClassId && relatedObjects?.twinClassMap) {
    hydrated.inputTwinClass = relatedObjects.twinClassMap[
      dto.inputTwinClassId
    ] as TwinClass_DETAILED;
  }

  if (dto.twinFactoryConditionSetId && relatedObjects?.factoryConditionSetMap) {
    hydrated.factoryConditionSet =
      relatedObjects.factoryConditionSetMap[dto.twinFactoryConditionSetId];
  }

  if (dto.twinTriggerId && relatedObjects?.triggerMap) {
    hydrated.twinTrigger = relatedObjects.triggerMap[dto.twinTriggerId];
  }

  return hydrated;
}
