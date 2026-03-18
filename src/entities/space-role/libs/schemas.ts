import { z } from "zod";

import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const SPACE_ROLE_SHEMA = z.object({
  key: z.string().min(1, "Key can not be empty"),
  name: z.string().min(1, "Name can not be empty"),
  description: z.string().optional(),
  twinClassId: z
    .string()
    .uuid("Twin class ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  businessAccountId: z.string().or(FIRST_ID_EXTRACTOR),
});
