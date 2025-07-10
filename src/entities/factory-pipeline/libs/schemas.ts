import { z } from "zod";

import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const FACTORY_PIPELINE_SCHEMA = z.object({
  factoryId: z
    .string()
    .uuid("Factory ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  inputTwinClassId: z
    .string()
    .uuid("Input Twin Class ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  factoryConditionSetId: z
    .string()
    .uuid("Factory condition set ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  factoryConditionSetInvert: z.boolean(),
  active: z.boolean(),
  outputStatusId: z
    .string()
    .uuid("Output Twin Status ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  nextFactoryId: z
    .string()
    .uuid("Next Factory ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  description: z.string().optional(),
});
