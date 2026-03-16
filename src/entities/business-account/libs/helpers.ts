import { NotificationSchema } from "@/entities/notification";
import { PermissionSchema } from "@/entities/permission-schema";
import { Tier } from "@/entities/tier";
import { TwinClassSchema } from "@/entities/twin-class-schema";
import { TwinFlowSchema } from "@/entities/twinFlowSchema";
import { RelatedObjects } from "@/shared/api";

import {
  BusinessAccount,
  DomainBusinessAccount,
  DomainBusinessAccount_DETAILED,
} from "../api";

export const hydrateBusinessAccountFromMap = (
  dto: DomainBusinessAccount,
  relatedObjects?: RelatedObjects
): DomainBusinessAccount_DETAILED => {
  const hydrated: DomainBusinessAccount_DETAILED = Object.assign(
    {},
    dto
  ) as DomainBusinessAccount_DETAILED;

  if (dto.businessAccountId && relatedObjects?.businessAccountMap) {
    hydrated.businessAccount = relatedObjects.businessAccountMap[
      dto.businessAccountId
    ] as BusinessAccount;
  }

  if (dto.permissionSchemaId && relatedObjects?.permissionSchemaMap) {
    hydrated.permissionSchema = relatedObjects.permissionSchemaMap[
      dto.permissionSchemaId
    ] as PermissionSchema;
  }

  if (dto.twinflowSchemaId && relatedObjects?.twinflowSchemaMap) {
    hydrated.twinflowSchema = relatedObjects.twinflowSchemaMap[
      dto.twinflowSchemaId
    ] as TwinFlowSchema;
  }

  if (dto.twinClassSchemaId && relatedObjects?.twinClassSchemaMap) {
    hydrated.twinClassSchema = relatedObjects.twinClassSchemaMap[
      dto.twinClassSchemaId
    ] as TwinClassSchema;
  }

  if (dto.notificationSchemaId && relatedObjects?.notificationSchemaMap) {
    hydrated.notificationSchema = relatedObjects.notificationSchemaMap[
      dto.notificationSchemaId
    ] as NotificationSchema;
  }

  if (dto.tierId && relatedObjects?.tierMap) {
    hydrated.tier = relatedObjects.tierMap[dto.tierId] as Tier;
  }

  return hydrated;
};
