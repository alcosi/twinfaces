import { Featurer_DETAILED } from "@/entities/featurer";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { User } from "@/entities/user";
import { ValidatorSet_DETAILED } from "@/entities/validator-set";
import { components } from "@/shared/api/generated/schema";

import { ExtendedFeaturerParam } from "../../../features/featurer/utils/helpers";

export type Recipient = components["schemas"]["HistoryNotificationRecipientV1"];

export type ChannelEvent = components["schemas"]["NotificationChannelEventV1"];

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
  historyNotificationRecipient?: Recipient;
  notificationChannelEvent?: ChannelEvent;
};

export type HistoryNotificationSearchRq =
  components["schemas"]["HistoryNotificationSearchRqV1"];

export type HistoryNotificationFilterKeys =
  | "idList"
  | "twinClassIdList"
  | "twinClassFieldIdList"
  | "historyNotificationRecipientIdList"
  | "historyTypeIdList"
  | "notificationSchemaIdList"
  | "notificationChannelEventIdList"
  | "twinValidatorSetIdList"
  | "twinValidatorSetInvert";

export type HistoryNotificationFilters = Partial<
  Pick<HistoryNotificationSearchRq, HistoryNotificationFilterKeys>
>;

export type NotificationUpdateRq =
  components["schemas"]["HistoryNotificationUpdateRequestV1"];

export type RecipientCollectorSearchRq =
  components["schemas"]["HistoryNotificationRecipientCollectorSearchV1"];

export type RecipientCollector =
  components["schemas"]["HistoryNotificationRecipientCollectorV1"];

export type RecipientCollector_DETAILED = Omit<
  RecipientCollector,
  "recipientResolverParams"
> & {
  historyNotificationRecipient?: Recipient_DETAILED;
  recipientResolverFeaturer?: Featurer_DETAILED;
  recipientResolverParams?: ExtendedFeaturerParam[];
};

export type RecipientCollectorsFilterKeys =
  | "idList"
  | "recipientIdList"
  | "recipientResolverFeaturerIdList"
  | "exclude";

export type RecipientCollectorsFilters = Partial<
  Pick<RecipientCollectorSearchRq, RecipientCollectorsFilterKeys>
>;
export type NotificationCreateRq =
  components["schemas"]["HistoryNotificationCreateRqV1"];
export type RecipientCreateRq =
  components["schemas"]["HistoryNotificationRecipientCreateRqV1"];
export type RecipientCreateV1 =
  components["schemas"]["HistoryNotificationRecipientCreateV1"];

export type RecipientUpdateRq =
  components["schemas"]["HistoryNotificationRecipientUpdateRqV1"];
export type RecipientUpdateV1 =
  components["schemas"]["HistoryNotificationRecipientUpdateV1"];

export type RecipientCollectorUpdateRq =
  components["schemas"]["HistoryNotificationRecipientCollectorUpdateRqV1"];
