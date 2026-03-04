import { User } from "@/entities/user";
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

export type RecipientCreateRq =
  components["schemas"]["HistoryNotificationRecipientCreateRqV1"];
export type RecipientCreateV1 =
  components["schemas"]["HistoryNotificationRecipientCreateV1"];

export type RecipientUpdateRq =
  components["schemas"]["HistoryNotificationRecipientUpdateRqV1"];
export type RecipientUpdateV1 =
  components["schemas"]["HistoryNotificationRecipientUpdateV1"];
