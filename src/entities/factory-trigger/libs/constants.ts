import { z } from "zod";

import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const FACTORY_TRIGGER_SCHEMA = z.object({
  twinFactoryId: z
    .string()
    .uuid("Factory trigger ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  inputTwinClassId: z
    .string()
    .uuid("Input twin class ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  twinFactoryConditionSetId: z
    .string()
    .uuid("Twin factory condition set ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  twinFactoryConditionInvert: z.boolean().default(false),
  active: z.boolean().default(false),
  description: z.string().optional(),
  twinTriggerId: z
    .string()
    .uuid("Twin trigger ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  async: z.boolean().default(false),
});
