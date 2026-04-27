import { z } from "zod";

import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const STATUS_TRIGGER_SCHEMA = z.object({
  twinStatusId: z
    .string()
    .uuid("Twin status ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  incomingElseOutgoing: z.boolean().default(false),
  order: z.coerce.number().min(0, "Order must be at least 0").default(0),
  twinTriggerId: z
    .string()
    .uuid("Twin trigger ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  async: z.boolean().default(false),
  active: z.boolean().default(false),
});
