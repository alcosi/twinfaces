import { RelatedObjects } from "@/shared/api";
import { FactoryBranche, FactoryBranche_DETAILED } from "../api";

export const hydrateFactoryBrancheFromMap = (
  dto: FactoryBranche,
  relatedObjects?: RelatedObjects
): FactoryBranche_DETAILED => {
  const hydrated: FactoryBranche_DETAILED = Object.assign(
    {},
    dto
  ) as FactoryBranche_DETAILED;

  if (dto.factoryId && relatedObjects?.factoryMap) {
    hydrated.factory = relatedObjects.factoryMap[dto.factoryId]!;
  }

  return hydrated;
};
