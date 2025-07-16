import { RelatedObjects } from "@/shared/api";

import { FactoryEraser, FactoryEraser_DETAILED } from "../api";

export function hydrateFactoryEraserFromMap(
  dto: FactoryEraser,
  relatedObjects?: RelatedObjects
): FactoryEraser_DETAILED {
  const hydrated: FactoryEraser_DETAILED = Object.assign(
    {},
    dto
  ) as FactoryEraser_DETAILED;

  if (dto.factoryId && relatedObjects?.factoryMap) {
    hydrated.factory = relatedObjects.factoryMap[dto.factoryId]!;
  }

  if (dto.inputTwinClassId && relatedObjects?.twinClassMap) {
    hydrated.inputTwinClass =
      relatedObjects.twinClassMap[dto.inputTwinClassId]!;
  }

  return hydrated;
}
