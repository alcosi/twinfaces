import { RelatedObjects } from "@/shared/api";
import { TwinClass, TwinClass_DETAILED } from "../api";
import { DataListsMap } from "@/entities/datalist";
import { Featurer_DETAILED } from "@/entities/featurer";
import { Permission } from "@/entities/permission";

export const hydrateTwinClassFromMap = (
  dto: TwinClass,
  relatedObjects?: RelatedObjects
): TwinClass_DETAILED => {
  const hydrated: TwinClass_DETAILED = Object.assign(
    {},
    dto
  ) as TwinClass_DETAILED;

  if (!relatedObjects?.twinClassMap) return hydrated;

  if (dto.headClassId) {
    hydrated.headClass = relatedObjects.twinClassMap[dto.headClassId];
  }

  if (dto.extendsClassId) {
    hydrated.extendsClass = relatedObjects.twinClassMap[dto.extendsClassId];
  }

  if (dto.markersDataListId && relatedObjects.dataListsMap) {
    hydrated.markerMap = relatedObjects.dataListsMap[
      dto.markersDataListId
    ] as DataListsMap;
  }

  if (dto.tagsDataListId && relatedObjects.dataListsMap) {
    hydrated.tagMap = relatedObjects.dataListsMap[
      dto.tagsDataListId
    ] as DataListsMap;
  }

  if (dto.headHunterFeaturerId && relatedObjects.featurerMap) {
    hydrated.headHunterFeaturer = relatedObjects.featurerMap[
      dto.headHunterFeaturerId
    ] as Featurer_DETAILED;
  }

  if (dto.viewPermissionId && relatedObjects.permissionMap) {
    hydrated.viewPermission = relatedObjects.permissionMap[
      dto.viewPermissionId
    ] as Permission;
  }

  return hydrated;
};
