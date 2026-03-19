import { DataList } from "@/entities/datalist";
import { DataListOptionV1 } from "@/entities/datalist-option";
import {
  OptionProjection,
  OptionProjection_DETAILED,
} from "@/entities/option-projections";
import { ProjectionType } from "@/entities/projection";
import { User } from "@/entities/user";
import { RelatedObjects } from "@/shared/api";

export const hydrateOptionProjectionFromMap = (
  dto: OptionProjection,
  relatedObjects?: RelatedObjects
): OptionProjection_DETAILED => {
  const hydrated: OptionProjection_DETAILED = Object.assign(
    {},
    dto
  ) as OptionProjection_DETAILED;

  if (dto.projectionTypeId && relatedObjects?.projectionTypeMap) {
    hydrated.projectionType = relatedObjects.projectionTypeMap[
      dto.projectionTypeId
    ] as ProjectionType;
  }

  if (dto.srcDataListOptionId && relatedObjects?.dataListsOptionMap) {
    hydrated.srcDataListOption = relatedObjects.dataListsOptionMap[
      dto.srcDataListOptionId
    ] as DataListOptionV1;
  }

  if (hydrated.srcDataListOption.dataListId && relatedObjects?.dataListsMap) {
    hydrated.srcDataList = relatedObjects.dataListsMap[
      hydrated.srcDataListOption.dataListId
    ] as DataList;
  }

  if (dto.dstDataListOptionId && relatedObjects?.dataListsOptionMap) {
    hydrated.dstDataListOption = relatedObjects.dataListsOptionMap[
      dto.dstDataListOptionId
    ] as DataListOptionV1;
  }

  if (hydrated.dstDataListOption.dataListId && relatedObjects?.dataListsMap) {
    hydrated.dstDataList = relatedObjects.dataListsMap[
      hydrated.dstDataListOption.dataListId
    ] as DataList;
  }

  if (dto.savedByUserId && relatedObjects?.userMap) {
    hydrated.savedByUser = relatedObjects.userMap[dto.savedByUserId] as User;
  }

  return hydrated;
};
