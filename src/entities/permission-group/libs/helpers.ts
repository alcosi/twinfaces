import { TwinClass_DETAILED } from "@/entities/twin-class";
import { RelatedObjects } from "@/shared/api";

import { PermissionGroup, PermissionGroup_DETAILED } from "../api";

export const hydratePermissionGroupFromMap = (
  permissionDTO: PermissionGroup,
  relatedObjects?: RelatedObjects
): PermissionGroup_DETAILED => {
  const hydrated: PermissionGroup_DETAILED = Object.assign(
    {},
    permissionDTO
  ) as PermissionGroup_DETAILED;

  if (permissionDTO.twinClassId && relatedObjects?.twinClassMap) {
    hydrated.twinClass = relatedObjects.twinClassMap[
      permissionDTO.twinClassId
    ] as TwinClass_DETAILED;
  }

  return hydrated;
};
