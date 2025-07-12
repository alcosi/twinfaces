import { Featurer_DETAILED } from "@/entities/featurer";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { RelatedObjects } from "@/shared/api";

import { TwinClassField, TwinClassFieldV2_DETAILED } from "../api";

export const hydrateTwinClassFieldFromMap = (
  dto: TwinClassField,
  relatedObjects?: RelatedObjects
): TwinClassFieldV2_DETAILED => {
  const hydrated: TwinClassFieldV2_DETAILED = Object.assign(
    {},
    dto
  ) as TwinClassFieldV2_DETAILED;

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
