import z from "zod";

import { FIRST_ID_EXTRACTOR, OPTIONAL_FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const NOTIFICATION_SCHEMA = z.object({
  twinClassId: z
    .string()
    .uuid("Twin class ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  twinClassFieldId: OPTIONAL_FIRST_ID_EXTRACTOR,
  historyTypeId: z.string().min(1, "History type is required"),
  notificationSchemaId: z
    .string()
    .uuid("Notification schema ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  historyNotificationRecipientId: z
    .string()
    .uuid("History notification recipient ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  notificationChannelEventId: z
    .string()
    .uuid("Notification channel event ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  twinValidatorSetId: OPTIONAL_FIRST_ID_EXTRACTOR,
  twinValidatorSetInvert: z.boolean().optional(),
});
