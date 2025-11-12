import { z } from "zod";

import { createEnum } from "@/shared/libs";

import { TwinFlowTransitionCreateRq } from "../api";
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

export type TransitionType = NonNullable<
  TwinFlowTransitionCreateRq["twinflowTransitionTypeId"]
>;
export const TRANSITION_TYPES: TransitionType[] = [
  "STATUS_CHANGE",
  "OPERATION",
  "MARKETING",
  "STATUS_CHANGE_MARKETING",
] as const;
export const TransitionTypesEnum = createEnum<TransitionType>(TRANSITION_TYPES);
