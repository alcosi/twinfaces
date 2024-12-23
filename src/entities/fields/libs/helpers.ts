import { RelatedObjects } from "@/shared/api";
import { Fields, Fields_DETAILED } from "@/entities/fields";
import { TwinClass_DETAILED } from "@/entities/twinClass";
import { Featurer_DETAILED } from "@/entities/featurer";

export const hydrateFieldsFromMap = (
  dto: Fields,
  relatedObjects?: RelatedObjects
): Fields_DETAILED => {
  const hydrated: Fields_DETAILED = Object.assign({}, dto) as Fields_DETAILED;

  if (dto.twinClassId && relatedObjects?.twinClassMap) {
    hydrated.twinClass = relatedObjects.twinClassMap[
      dto.twinClassId
    ] as TwinClass_DETAILED;
  }

  if (dto.viewPermissionId && relatedObjects?.permissionMap) {
    hydrated.viewPermission =
      relatedObjects.permissionMap[dto.viewPermissionId]!;
  }

  if (dto.editPermissionId && relatedObjects?.permissionMap) {
    hydrated.editPermission =
      relatedObjects.permissionMap[dto.editPermissionId]!;
  }

  if (dto.fieldTyperFeaturerId && relatedObjects?.featurerMap) {
    hydrated.fieldTyperFeaturer = relatedObjects.featurerMap[
      dto.fieldTyperFeaturerId
    ] as Featurer_DETAILED;
  }

  return hydrated;
};
