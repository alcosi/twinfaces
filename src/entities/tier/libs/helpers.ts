import { RelatedObjects } from "@/shared/api";

import { Tier, Tier_DETAILED } from "../api";

export const hydrateTierFromMap = (
  dto: Tier,
  relatedObjects?: RelatedObjects
): Tier_DETAILED => {
  const hydrated: Tier_DETAILED = Object.assign({}, dto) as Tier_DETAILED;

  if (dto.permissionSchemaId && relatedObjects?.permissionSchemaMap) {
    hydrated.permissionSchema =
      relatedObjects.permissionSchemaMap[dto.permissionSchemaId]!;
  }

  if (dto.twinflowSchemaId && relatedObjects?.twinflowMap) {
    hydrated.twinClassSchema =
      relatedObjects.twinflowMap[dto.twinflowSchemaId]!;
  }

  if (dto.twinClassSchemaId && relatedObjects?.twinClassSchemaMap) {
    hydrated.twinClassSchema =
      relatedObjects.twinClassSchemaMap[dto.twinClassSchemaId]!;
  }

  return hydrated;
};
