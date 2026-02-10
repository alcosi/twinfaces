import { z } from "zod";

import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const CONDITION_SET_SCHEMA = z.object({
  name: z.string().min(1).max(100),
  twinFactoryId: z
    .string()
    .uuid("Twin Factory ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  description: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});
