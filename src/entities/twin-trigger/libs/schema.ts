import z from "zod";

import {
  FEATURER_ID_EXTRACTOR,
  FEATURER_PARAMS_VALUE,
} from "@/entities/featurer";
import { OPTIONAL_FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const TWIN_TRIGGER_SCHEMA = z.object({
  triggerFeaturerId: z.number().or(FEATURER_ID_EXTRACTOR),
  triggerParams: FEATURER_PARAMS_VALUE,
  jobTwinClassId: OPTIONAL_FIRST_ID_EXTRACTOR,
  active: z.boolean(),
  name: z.string().optional(),
  description: z.string().optional(),
  order: z.coerce.number().min(0, "Order must be at least 0").default(0),
});
