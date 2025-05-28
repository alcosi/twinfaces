import { RelatedObjects } from "@/shared/api";

import { DomainView, DomainView_DETAILED } from "../api";

export const hydrateDomainView = (
  dto: DomainView,
  relatedObjects?: RelatedObjects
): DomainView_DETAILED => {
  const hydrated: DomainView_DETAILED = Object.assign(
    {},
    dto
  ) as DomainView_DETAILED;

  if (dto.businessAccountInitiatorFeaturerId && relatedObjects?.featurerMap) {
    hydrated.businessAccountInitiatorFeaturer =
      relatedObjects?.featurerMap[dto.businessAccountInitiatorFeaturerId]!;
  }

  if (dto.userGroupManagerFeaturerId && relatedObjects?.featurerMap) {
    hydrated.userGroupManagerFeaturer =
      relatedObjects.featurerMap[dto.userGroupManagerFeaturerId]!;
  }

  if (dto.permissionSchemaId && relatedObjects?.permissionSchemaMap) {
    hydrated.permissionSchema =
      relatedObjects.permissionSchemaMap[dto.permissionSchemaId]!;
  }

  if (dto.businessAccountTemplateTwinId && relatedObjects?.twinMap) {
    hydrated.twin = relatedObjects.twinMap[dto.businessAccountTemplateTwinId]!;
  }

  if (dto.navbarFaceId && relatedObjects?.faceMap) {
    hydrated.navbarFace = relatedObjects.faceMap[dto.navbarFaceId]!;
  }

  if (dto.twinClassSchemaId && relatedObjects?.twinClassSchemaMap) {
    hydrated.twinClassSchema =
      relatedObjects.twinClassSchemaMap[dto.twinClassSchemaId]!;
  }

  if (dto.defaultTierId && relatedObjects?.tierMap) {
    hydrated.tier = relatedObjects.tierMap[dto.defaultTierId]!;
  }

  if (dto.domainUserTemplateTwinId && relatedObjects?.twinMap) {
    hydrated.domainUserTemplateTwin =
      relatedObjects.twinMap[dto.domainUserTemplateTwinId]!;
  }

  return hydrated;
};
