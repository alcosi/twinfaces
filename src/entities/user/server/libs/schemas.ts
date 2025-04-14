import { z } from "zod";

import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const LOGIN_FORM_SCHEMA = z.object({
  domainId: z
    .string()
    .uuid("Domain ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  userId: z.string().uuid("Please enter a valid UUID"),
  businessAccountId: z
    .string()
    .uuid("Please enter a valid UUID")
    .optional()
    .or(z.literal("")),
});
