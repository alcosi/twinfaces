import { FIRST_UUID_EXTRACTOR, REGEX_PATTERNS } from "@/shared/libs";
import { z } from "zod";

export const TWIN_CLASS_FIELD_SCHEMA = z.object({
  twinClassId: z.string().uuid().nullable().or(FIRST_UUID_EXTRACTOR),
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
  required: z.boolean(),
  fieldTyperFeaturerId: z.number(),
  fieldTyperParams: z.record(z.string()),
  viewPermissionId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  editPermissionId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});
