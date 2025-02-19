import { FIRST_ID_EXTRACTOR } from "@/shared/libs";
import { z } from "zod";

export const FACTORY_BRANCHE_SCHEMA = z.object({
  factoryConditionSetId: z
    .string()
    .uuid("Factory Condition Set ID must be a valid UUID ")
    .or(FIRST_ID_EXTRACTOR),
  factoryConditionSetInvert: z.boolean(),
  description: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  active: z.boolean(),
});
