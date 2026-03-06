import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { User } from "@/entities/user";
import { ValidatorSet_DETAILED } from "@/entities/validator-set";
import { components } from "@/shared/api/generated/schema";

export type Recipient = components["schemas"]["HistoryNotificationRecipientV1"];

export type Recipient_DETAILED = Recipient & { createdByUser?: User };

export type RecipientSearchRq =
  components["schemas"]["HistoryNotificationRecipientSearchV1"];

export type RecipientFilterKeys =
  | "idList"
  | "nameLikeList"
  | "descriptionLikeList";

export type RecipientFilters = Partial<
  Pick<RecipientSearchRq, RecipientFilterKeys>
>;

export type Notification = components["schemas"]["HistoryNotificationV1"];

export type NotificationSchema = components["schemas"]["NotificationSchemaV1"];

export type Notification_DETAILED = Notification & {
  twinClass?: TwinClass_DETAILED;
  twinClassField?: TwinClassField_DETAILED;
  twinValidatorSet?: ValidatorSet_DETAILED;
  notificationSchema?: NotificationSchema;
};

export type NotificationSearchRq =
  components["schemas"]["HistoryNotificationSearchRqV1"];

export type NotificationFilterKeys =
  | "idList"
  | "twinClassIdList"
  | "twinClassFieldIdList"
  | "historyTypeIdList"
  | "notificationSchemaIdList"
  | "historyNotificationRecipientIdList"
  | "notificationChannelEventIdList"
  | "twinValidatorSetIdList"
  | "twinValidatorSetInvert";

export type NotificationFilters = Partial<
  Pick<NotificationSearchRq, NotificationFilterKeys>
>;
