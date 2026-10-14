import { z } from "zod";

import { FIRST_ID_EXTRACTOR, REGEX_PATTERNS } from "@/shared/libs";

export const DOMAIN_ID_SCHEMA = z
  .string()
  .uuid("Domain ID must be a valid UUID")
  .or(FIRST_ID_EXTRACTOR);

// Per DomainCreateV1 only key and type are required.
export const DOMAIN_CREATE_SCHEMA = z.object({
  name: z
    .string()
    .optional()
    .transform((value) => value || undefined),
  key: z
    .string()
    .min(1, "Key can not be empty")
    .min(3)
    .max(100)
    .regex(
      REGEX_PATTERNS.ALPHANUMERIC_WITH_DASHES,
      "Key can only contain latin letters, numbers, underscores and dashes"
    ),
  description: z
    .string()
    .optional()
    .transform((value) => value || undefined),
  type: z.enum(["basic", "b2b"], {
    message: "Select account type",
  }),
  defaultLocale: z.enum(["en", "ru"]).optional(),
});
