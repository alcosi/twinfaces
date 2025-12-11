import { z } from "zod";

import {
  FEATURER_ID_EXTRACTOR,
  FEATURER_PARAMS_VALUE,
} from "@/entities/featurer";
import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const FACTORY_CONDITION_SCHEMA = z.object({
  factoryConditionSetId: z
    .string()
    .uuid("Condition Set ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  conditionerFeatureId: z.number().or(FEATURER_ID_EXTRACTOR),
  conditionerParams: FEATURER_PARAMS_VALUE,
  description: z.string().optional(),
  active: z.boolean(),
  invert: z.boolean(),
});
