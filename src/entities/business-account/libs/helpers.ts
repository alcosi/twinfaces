import { NotificationSchema } from "@/entities/notification";
import { PermissionSchema } from "@/entities/permission-schema";
import { Tier } from "@/entities/tier";
import { TwinClassSchema } from "@/entities/twin-class-schema";
import { TwinFlowSchema } from "@/entities/twinFlowSchema";
import { User_DETAILED } from "@/entities/user";
import { UserGroup_DETAILED } from "@/entities/user-group";
import { RelatedObjects } from "@/shared/api";

import {
  BusinessAccount,
  DomainBusinessAccount,
  DomainBusinessAccountUser,
  DomainBusinessAccountUser_DETAILED,
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

export const hydrateBusinessAccountUserFromMap = (
  dto: DomainBusinessAccountUser,
  relatedObjects?: RelatedObjects
): DomainBusinessAccountUser_DETAILED => {
  const hydrated: DomainBusinessAccountUser_DETAILED = Object.assign(
    {},
    dto
  ) as DomainBusinessAccountUser_DETAILED;

  if (dto.userId && relatedObjects?.userMap) {
    hydrated.user = relatedObjects.userMap[dto.userId] as User_DETAILED;
  }

  if (dto.businessAccountId && relatedObjects?.businessAccountMap) {
    hydrated.businessAccount = relatedObjects.businessAccountMap[
      dto.businessAccountId
    ] as DomainBusinessAccount_DETAILED;
  }

  if (dto.userGroupIds?.length && relatedObjects?.userGroupMap) {
    hydrated.userGroups = dto.userGroupIds
      .map((userGroupId) => relatedObjects.userGroupMap?.[userGroupId])
      .filter(Boolean) as UserGroup_DETAILED[];
  }

  return hydrated;
};
