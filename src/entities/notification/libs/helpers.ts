import { Featurer_DETAILED } from "@/entities/featurer";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { User } from "@/entities/user";
import { ValidatorSet_DETAILED } from "@/entities/validator-set";

import { extendFeaturerParams } from "../../../features/featurer/utils/helpers";
import { RelatedObjects } from "../../../shared/api/types";
import {
  ChannelEvent,
  NotificationSchema,
  Notification_DETAILED,
  Recipient,
  RecipientCollector,
  RecipientCollector_DETAILED,
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

  if (
    dto.historyNotificationRecipientId &&
    relatedObjects?.historyNotificationRecipientMap
  ) {
    hydrated.historyNotificationRecipient = relatedObjects
      .historyNotificationRecipientMap[
      dto.historyNotificationRecipientId
    ] as Recipient;
  }

  if (
    dto.notificationChannelEventId &&
    relatedObjects?.notificationChannelEventMap
  ) {
    hydrated.notificationChannelEvent = relatedObjects
      .notificationChannelEventMap[
      dto.notificationChannelEventId
    ] as ChannelEvent;
  }

  return hydrated;
};

export const hydrateHistoryNotificationRecipientCollectorFromMap = (
  dto: RecipientCollector,
  relatedObjects?: RelatedObjects
): RecipientCollector_DETAILED => {
  const hydrated: RecipientCollector_DETAILED = Object.assign(
    {},
    dto
  ) as RecipientCollector_DETAILED;

  if (dto.recipientId && relatedObjects?.historyNotificationRecipientMap) {
    hydrated.historyNotificationRecipient = relatedObjects
      .historyNotificationRecipientMap[dto.recipientId] as Recipient_DETAILED;
  }

  if (dto.recipientResolverFeaturerId && relatedObjects?.featurerMap) {
    hydrated.recipientResolverFeaturer = relatedObjects.featurerMap[
      dto.recipientResolverFeaturerId
    ] as Featurer_DETAILED;
  }

  if (
    hydrated.recipientResolverParams &&
    hydrated.recipientResolverFeaturer?.params
  ) {
    hydrated.recipientResolverParams = extendFeaturerParams(
      dto.recipientResolverParams,
      hydrated.recipientResolverFeaturer.params
    );
  }

  return hydrated;
};
