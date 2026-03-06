import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { User } from "@/entities/user";
import { ValidatorSet_DETAILED } from "@/entities/validator-set";

import { RelatedObjects } from "../../../shared/api/types";
import {
  NotificationSchema,
  Notification_DETAILED,
  Recipient_DETAILED,
} from "../api/types";

export const hydrateRecipientFromMap = (
  dto: Recipient_DETAILED,
  relatedObjects?: RelatedObjects
): Recipient_DETAILED => {
  const hydrated: Recipient_DETAILED = Object.assign(
    {},
    dto
  ) as Recipient_DETAILED;

  if (dto.createdByUserId && relatedObjects?.userMap) {
    hydrated.createdByUser = relatedObjects.userMap[
      dto.createdByUserId
    ] as User;
  }

  return hydrated;
};

export const hydrateNotificationsFromMap = (
  dto: Notification_DETAILED,
  relatedObjects?: RelatedObjects
): Notification_DETAILED => {
  const hydrated: Notification_DETAILED = Object.assign(
    {},
    dto
  ) as Notification_DETAILED;

  if (dto.twinClassId && relatedObjects?.twinClassMap) {
    hydrated.twinClass = relatedObjects.twinClassMap[
      dto.twinClassId
    ] as TwinClass_DETAILED;
  }

  if (dto.twinClassFieldId && relatedObjects?.twinClassFieldMap) {
    hydrated.twinClassField = relatedObjects.twinClassFieldMap[
      dto.twinClassFieldId
    ] as TwinClassField_DETAILED;
  }

  if (dto.twinValidatorSetId && relatedObjects?.twinValidatorSetMap) {
    hydrated.twinValidatorSet = relatedObjects.twinValidatorSetMap[
      dto.twinValidatorSetId
    ] as ValidatorSet_DETAILED;
  }

  if (dto.notificationSchemaId && relatedObjects?.notificationSchemaMap) {
    hydrated.notificationSchema = relatedObjects.notificationSchemaMap[
      dto.notificationSchemaId
    ] as NotificationSchema;
  }

  return hydrated;
};
