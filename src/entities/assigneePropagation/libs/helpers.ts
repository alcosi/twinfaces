import { RelatedObjects } from "@/shared/api";
import {
  PermissionGrantAssigneePropagation,
  PermissionGrantAssigneePropagation_DETAILED,
} from "@/entities/assigneePropagation";
import { TwinClass_DETAILED } from "@/entities/twinClass";

export const hydratePermissionGrantAssigneePropagationFromMap = (
  permissionGrantAssigneePropagationsDTO: PermissionGrantAssigneePropagation,
  relatedObjects?: RelatedObjects
): PermissionGrantAssigneePropagation_DETAILED => {
  const permissionGrantAssigneePropagation: PermissionGrantAssigneePropagation_DETAILED =
    Object.assign(
      {},
      permissionGrantAssigneePropagationsDTO
    ) as PermissionGrantAssigneePropagation_DETAILED;

  if (
    permissionGrantAssigneePropagationsDTO.grantedByUserId &&
    relatedObjects?.userMap
  ) {
    permissionGrantAssigneePropagation.grantedByUser =
      relatedObjects.userMap[
        permissionGrantAssigneePropagationsDTO.grantedByUserId
      ]!;
  }

  if (
    permissionGrantAssigneePropagationsDTO.permissionSchemaId &&
    relatedObjects?.permissionSchemaMap
  ) {
    permissionGrantAssigneePropagation.permissionSchema =
      relatedObjects.permissionSchemaMap[
        permissionGrantAssigneePropagationsDTO.permissionSchemaId
      ]!;
  }

  if (
    permissionGrantAssigneePropagationsDTO.propagationTwinClassId &&
    relatedObjects?.twinClassMap
  ) {
    permissionGrantAssigneePropagation.propagationTwinClass = relatedObjects
      .twinClassMap[
      permissionGrantAssigneePropagationsDTO.propagationTwinClassId
    ] as TwinClass_DETAILED;
  }

  if (
    permissionGrantAssigneePropagationsDTO.propagationTwinStatusId &&
    relatedObjects?.statusMap
  ) {
    permissionGrantAssigneePropagation.propagationTwinStatus =
      relatedObjects.statusMap[
        permissionGrantAssigneePropagationsDTO.propagationTwinStatusId
      ]!;
  }

  return permissionGrantAssigneePropagation;
};
