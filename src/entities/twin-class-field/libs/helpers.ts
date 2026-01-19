import { Featurer_DETAILED, extendFeaturerParams } from "@/entities/featurer";
import { Permission_DETAILED } from "@/entities/permission";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { RelatedObjects } from "@/shared/api";

import { TwinClassField, TwinClassFieldV1_DETAILED } from "../api";

export const hydrateTwinClassFieldFromMap = (
  dto: TwinClassField,
  relatedObjects?: RelatedObjects
): TwinClassFieldV1_DETAILED => {
  const hydrated: TwinClassFieldV1_DETAILED = Object.assign(
    {},
    dto
  ) as TwinClassFieldV1_DETAILED;

  if (dto.twinClassId && relatedObjects?.twinClassMap) {
    hydrated.twinClass = relatedObjects.twinClassMap[
      dto.twinClassId
    ] as TwinClass_DETAILED;
  }

  if (dto.viewPermissionId && relatedObjects?.permissionMap) {
    hydrated.viewPermission = relatedObjects.permissionMap[
      dto.viewPermissionId
    ] as Permission_DETAILED;
  }

  if (dto.editPermissionId && relatedObjects?.permissionMap) {
    hydrated.editPermission = relatedObjects.permissionMap[
      dto.editPermissionId
    ] as Permission_DETAILED;
  }

  if (dto.fieldTyperFeaturerId && relatedObjects?.featurerMap) {
    hydrated.fieldTyperFeaturer = relatedObjects.featurerMap[
      dto.fieldTyperFeaturerId
    ] as Featurer_DETAILED;
  }

  if (dto.twinSorterFeaturerId && relatedObjects?.featurerMap) {
    hydrated.twinSorterFeaturer = relatedObjects.featurerMap[
      dto.twinSorterFeaturerId
    ] as Featurer_DETAILED;
  }

  if (hydrated.fieldTyperParams && hydrated.fieldTyperFeaturer?.params) {
    hydrated.fieldTyperDetailedParams = extendFeaturerParams(
      hydrated.fieldTyperParams,
      hydrated.fieldTyperFeaturer.params
    );
  }

  if (hydrated.twinSorterParams && hydrated.twinSorterFeaturer?.params) {
    hydrated.twinSorterDetailedParams = extendFeaturerParams(
      hydrated.twinSorterParams,
      hydrated.twinSorterFeaturer.params
    );
  }

  return hydrated;
};
