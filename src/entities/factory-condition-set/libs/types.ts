import { z } from "zod";

import { CONDITION_SET_SCHEMA } from "./constants";

// Form Types
export type ConditionSetFieldValues = z.infer<typeof CONDITION_SET_SCHEMA>;
