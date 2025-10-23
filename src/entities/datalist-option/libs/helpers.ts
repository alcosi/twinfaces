import { RelatedObjects } from "@/shared/api";

import { DataListOptionV1, DataListOption_DETAILED } from "../api";

export function hydrateDatalistOptionFromMap(
  dto: DataListOptionV1,
  relatedObjects?: RelatedObjects
): DataListOption_DETAILED {
  const hydrate: DataListOption_DETAILED = Object.assign(
    {},
    dto
  ) as DataListOption_DETAILED;

  if (dto.dataListId && relatedObjects?.dataListsMap) {
    hydrate.dataList = relatedObjects.dataListsMap[dto.dataListId]!;
  }

  return hydrate;
}
