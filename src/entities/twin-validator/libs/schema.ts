import { z } from "zod";

import {
  FEATURER_ID_EXTRACTOR,
  FEATURER_PARAMS_VALUE,
} from "@/entities/featurer";
import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const TWIN_VALIDATOR_SCHEMA = z.object({
  twinValidatorSetId: z
    .string()
    .uuid("Validator set ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  validatorFeaturerId: z.number().or(FEATURER_ID_EXTRACTOR),
  validatorParams: FEATURER_PARAMS_VALUE,
  description: z.string().optional(),
  invert: z.boolean(),
  active: z.boolean(),
  order: z.coerce.number().min(0, "Order must be at least 0").default(0),
});
