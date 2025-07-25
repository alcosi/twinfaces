import { z } from "zod";

import { FIRST_ID_EXTRACTOR, REGEX_PATTERNS } from "@/shared/libs";

export const TWIN_CLASS_STATUS_SCHEMA = z.object({
  twinClassId: z.string().uuid().nullable().or(FIRST_ID_EXTRACTOR),
  key: z
    .string()
    .min(1)
    .max(100)
    .regex(
      REGEX_PATTERNS.ALPHANUMERIC_WITH_DASHES,
      "Key can only contain latin letters, numbers, underscores and dashes"
    ),
  name: z.string().min(0).max(100),
  description: z.string(),
  logo: z
    .string()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  backgroundColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex color code")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  fontColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex color code")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});
