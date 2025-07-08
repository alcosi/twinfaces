import { RelatedObjects } from "@/shared/api";

import { FactoryBranch, FactoryBranch_DETAILED } from "../api";

export const hydrateFactoryBranchFromMap = (
  dto: FactoryBranch,
  relatedObjects?: RelatedObjects
): FactoryBranch_DETAILED => {
  const hydrated: FactoryBranch_DETAILED = Object.assign(
    {},
    dto
  ) as FactoryBranch_DETAILED;

  if (dto.factoryId && relatedObjects?.factoryMap) {
    hydrated.factory = relatedObjects.factoryMap[dto.factoryId]!;
  }

  if (dto.nextFactoryId && relatedObjects?.factoryMap) {
    hydrated.nextFactory = relatedObjects.factoryMap[dto.nextFactoryId]!;
  }

  return hydrated;
};
