import {
  PermissionGrantAssigneePropagation,
  PermissionGrantAssigneePropagation_DETAILED,
} from "@/entities/assigneePropagation";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { RelatedObjects } from "@/shared/api";

export const hydratePermissionGrantAssigneePropagationFromMap = (
  dto: PermissionGrantAssigneePropagation,
  relatedObjects?: RelatedObjects
): PermissionGrantAssigneePropagation_DETAILED => {
  const hydrated: PermissionGrantAssigneePropagation_DETAILED = Object.assign(
    {},
    dto
  ) as PermissionGrantAssigneePropagation_DETAILED;

  if (dto.grantedByUserId && relatedObjects?.userMap) {
    hydrated.grantedByUser = relatedObjects.userMap[dto.grantedByUserId]!;
  }

  if (dto.permissionSchemaId && relatedObjects?.permissionSchemaMap) {
    hydrated.permissionSchema =
      relatedObjects.permissionSchemaMap[dto.permissionSchemaId]!;
  }

  if (hydrated.propagationTwinClassId && relatedObjects?.twinClassMap) {
    hydrated.propagationTwinClass = relatedObjects.twinClassMap[
      hydrated.propagationTwinClassId
    ] as TwinClass_DETAILED;
  }

  if (hydrated.propagationTwinStatusId && relatedObjects?.statusMap) {
    hydrated.propagationTwinStatus =
      relatedObjects.statusMap[hydrated.propagationTwinStatusId]!;
  }

  return hydrated;
};
