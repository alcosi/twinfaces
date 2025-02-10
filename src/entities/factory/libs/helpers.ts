import { RelatedObjects } from "@/shared/api";
import { Factory, Factory_DETAILED } from "../api";

export const hydrateFactoryFromMap = (
  dto: Factory,
  relatedObjects?: RelatedObjects
): Factory_DETAILED => {
  const hydrated: Factory_DETAILED = Object.assign({}, dto) as Factory_DETAILED;

  if (dto.createdByUserId && relatedObjects?.userMap) {
    hydrated.createdByUser = relatedObjects.userMap[dto.createdByUserId];
  }

  return hydrated;
};
