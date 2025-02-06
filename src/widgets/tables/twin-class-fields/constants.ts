import { FIRST_ID_EXTRACTOR, REGEX_PATTERNS } from "@/shared/libs";
import { z } from "zod";

export const TWIN_CLASS_FIELD_SCHEMA = z.object({
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
  required: z.boolean(),
  fieldTyperFeaturerId: z.number(),
  fieldTyperParams: z.record(z.string()),
  //TODO fix any
  viewPermissionId: z.any(),
  editPermissionId: z.any(),
});
