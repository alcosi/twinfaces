import { z } from "zod";

import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const TRIGGER_SCHEMA_IMPORT = z.object({
  order: z.coerce.number().min(0).default(0),
  active: z.boolean().default(false),
  async: z.boolean().default(false),
  twinTriggerId: z
    .string()
    .uuid("Trigger ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  twinflowTransitionId: z
    .string()
    .uuid("Transition ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
});
