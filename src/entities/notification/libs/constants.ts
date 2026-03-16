import { z } from "zod";

import { FEATURER_ID_EXTRACTOR } from "@/entities/featurer";
import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const RECIPIENT_SCHEMA = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type RecipientFieldValues = z.infer<typeof RECIPIENT_SCHEMA>;

export const RECIPIENT_COLLECTOR_SCHEMA = z.object({
  recipientId: z
    .string()
    .uuid("Recipient ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  recipientResolverFeaturerId: z.number().or(FEATURER_ID_EXTRACTOR),
  exclude: z.boolean(),
});
