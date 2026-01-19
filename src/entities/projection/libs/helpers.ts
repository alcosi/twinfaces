import { extendFeaturerParams } from "@/entities/featurer";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { RelatedObjects } from "@/shared/api";

import { Projection, Projection_DETAILED } from "../api";

export const hydrateProjectionFromMap = (
  dto: Projection,
  relatedObjects?: RelatedObjects
): Projection_DETAILED => {
  const hydrated: Projection_DETAILED = Object.assign(
    {},
    dto
  ) as Projection_DETAILED;

  if (dto.projectionTypeId && relatedObjects?.projectionTypeMap) {
    hydrated.projectionType =
      relatedObjects.projectionTypeMap[dto.projectionTypeId];
  }

  if (dto.srcTwinClassFieldId && relatedObjects?.twinClassFieldMap) {
    hydrated.srcTwinClassField = relatedObjects.twinClassFieldMap[
      dto.srcTwinClassFieldId
    ] as TwinClassField_DETAILED;
  }

  if (dto.dstTwinClassId && relatedObjects?.twinClassMap) {
    hydrated.dstTwinClass = relatedObjects.twinClassMap[
      dto.dstTwinClassId
    ] as TwinClass_DETAILED;
  }

  if (dto.dstTwinClassFieldId && relatedObjects?.twinClassFieldMap) {
    hydrated.dstTwinClassField = relatedObjects.twinClassFieldMap[
      dto.dstTwinClassFieldId
    ] as TwinClassField_DETAILED;
  }

  if (dto.fieldProjectorFeaturerId && relatedObjects?.featurerMap) {
    hydrated.fieldProjectorFeaturer =
      relatedObjects.featurerMap[dto.fieldProjectorFeaturerId];
  }

  if (
    hydrated.fieldProjectorParams &&
    hydrated.fieldProjectorFeaturer?.params
  ) {
    hydrated.projectorDetailedParams = extendFeaturerParams(
      hydrated.fieldProjectorParams,
      hydrated.fieldProjectorFeaturer.params
    );
  }

  return hydrated;
};
