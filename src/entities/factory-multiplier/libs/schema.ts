import { z } from "zod";

import {
  FEATURER_ID_EXTRACTOR,
  FEATURER_PARAMS_VALUE,
} from "@/entities/featurer";
import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const FACTORY_MULTIPLIER_SCHEMA = z.object({
  factoryId: z
    .string()
    .uuid("Factory ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  inputTwinClassId: z
    .string()
    .uuid("Input Twin Class ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  multiplierFeaturerId: z.number().or(FEATURER_ID_EXTRACTOR),
  multiplierParams: FEATURER_PARAMS_VALUE,
  active: z.boolean(),
  description: z.string().optional(),
});
