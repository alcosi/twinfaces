import { z } from "zod";

import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const STUB_AUTH_FORM_SCHEMA = z.object({
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

export const EMAIL_PASSWORD_AUTH_FORM_SCHEMA = z.object({
  domainId: z
    .string()
    .uuid("Domain ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  username: z.string().email(),
  password: z.string().min(8, { message: "minLengthErrorMessage" }),
});
