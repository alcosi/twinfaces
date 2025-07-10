import { z } from "zod";

import {
  FEATURER_ID_EXTRACTOR,
  FEATURER_PARAMS_VALUE,
} from "@/entities/featurer";
import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const PIPELINE_STEP_SCHEMA = z.object({
  factoryPipelineId: z
    .string()
    .uuid("Pipeline step ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  order: z.coerce.number().min(0, "Order must be at least 0").default(0),
  factoryConditionSetId: z
    .string()
    .uuid("Factory condition set ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  factoryConditionSetInvert: z.boolean(),
  fillerFeaturerId: z.number().or(FEATURER_ID_EXTRACTOR),
  fillerParams: FEATURER_PARAMS_VALUE,
  optional: z.boolean(),
  active: z.boolean(),
  description: z.string().optional(),
});
