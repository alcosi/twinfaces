import { z } from "zod";

import {
  TRIGGER_SCHEMA,
  TWIN_FLOW_TRANSITION_SCHEMA,
  VALIDATOR_RULES_SCHEMA,
} from "./constants";

export type TwinFlowTransitionFormValues = z.infer<
  typeof TWIN_FLOW_TRANSITION_SCHEMA
>;

export type TriggersFormValues = z.infer<typeof TRIGGER_SCHEMA>;
export type ValidatorRulesFormValues = z.infer<typeof VALIDATOR_RULES_SCHEMA>;
