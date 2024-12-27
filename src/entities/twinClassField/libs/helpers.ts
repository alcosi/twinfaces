import { RelatedObjects } from "@/shared/api";
import { TwinClassFieldV2, TwinClassFieldV2_DETAILED } from "../api";
import { TwinClass_DETAILED } from "@/entities/twinClass";
import { Featurer_DETAILED } from "@/entities/featurer";

export const hydrateTwinclassFieldFromMap = (
  dto: TwinClassFieldV2,
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
