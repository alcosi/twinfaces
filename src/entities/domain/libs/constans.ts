import { z } from "zod";

import { FIRST_ID_EXTRACTOR, REGEX_PATTERNS } from "@/shared/libs";

export const DOMAIN_ID_SCHEMA = z
  .string()
  .uuid("Domain ID must be a valid UUID")
  .or(FIRST_ID_EXTRACTOR);

export const DOMAIN_CREATE_SCHEMA = z.object({
  name: z.string().min(1, "Name can not be empty"),
  key: z
    .string()
    .min(3)
    .max(100)
    .regex(
      REGEX_PATTERNS.ALPHANUMERIC_WITH_DASHES,
      "Key can only contain latin letters, numbers, underscores and dashes"
    ),
  description: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  type: z.enum(["basic", "b2b"], {
    message: "Select account type",
  }),
  defaultLocale: z.enum(["en", "ru"], {
    message: "Select language",
  }),
});
