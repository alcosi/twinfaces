import { FIRST_ID_EXTRACTOR } from "@/shared/libs";
import { z } from "zod";

export const FACTORY_BRANCH_SCHEMA = z.object({
  factoryId: z
    .string()
    .uuid("Factory ID must be a valid UUID ")
    .or(FIRST_ID_EXTRACTOR),
  factoryConditionSetId: z
    .string()
    .uuid("Factory Condition Set ID must be a valid UUID ")
    .or(FIRST_ID_EXTRACTOR),
  factoryConditionSetInvert: z.boolean(),
  description: z.string().optional(),
  active: z.boolean(),
  nextFactoryId: z
    .string()
    .uuid("Next Factory ID must be a valid UUID ")
    .or(FIRST_ID_EXTRACTOR),
});
