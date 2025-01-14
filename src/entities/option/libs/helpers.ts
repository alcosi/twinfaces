import { RelatedObjects } from "@/shared/api";
import { DataListOptionV3 } from "../api";

export const hydrateDatalistOptionFromMap = (
  dto: DataListOptionV3,
  relatedObjects?: RelatedObjects
): DataListOptionV3 => {
  const hydrate: DataListOptionV3 = Object.assign({}, dto) as DataListOptionV3;

  if (dto.dataListId && relatedObjects?.dataListsMap) {
    hydrate.dataList = relatedObjects.dataListsMap[dto.dataListId];
  }

  return hydrate;
};
