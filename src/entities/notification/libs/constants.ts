import { z } from "zod";

import {
  FEATURER_ID_EXTRACTOR,
  FEATURER_PARAMS_VALUE,
} from "@/entities/featurer";
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
  // An untouched combobox holds `undefined`, which fails both branches; without
  // the error map the user would only see zod's generic "Invalid input".
  recipientResolverFeaturerId: z.union([z.number(), FEATURER_ID_EXTRACTOR], {
    errorMap: () => ({ message: "Recipient resolver featurer is required" }),
  }),
  recipientResolverParams: FEATURER_PARAMS_VALUE,
  exclude: z.boolean(),
});
