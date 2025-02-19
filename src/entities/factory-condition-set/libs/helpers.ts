import { RelatedObjects } from "@/shared/api";
import { FactoryConditionSet, FactoryConditionSet_DETAILED } from "../api";

export const hydrateFactoryConditionSetFromMap = (
  dto: FactoryConditionSet,
  relatedObjects?: RelatedObjects
): FactoryConditionSet_DETAILED => {
  const hydrated: FactoryConditionSet_DETAILED = Object.assign(
    {},
    dto
  ) as FactoryConditionSet_DETAILED;

  if (dto.createdByUserId && relatedObjects?.userMap) {
    hydrated.updatedAt = relatedObjects.userMap[dto.createdByUserId];
  }

  return hydrated;
};
