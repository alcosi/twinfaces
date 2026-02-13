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
