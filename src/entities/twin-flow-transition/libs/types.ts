import { z } from "zod";

import { createEnum } from "@/shared/libs";

import { TwinFlowTransitionCreate } from "../api/types";
import { TRIGGER_SCHEMA, TWIN_FLOW_TRANSITION_SCHEMA } from "./constants";

export type TwinFlowTransitionFormValues = z.infer<
  typeof TWIN_FLOW_TRANSITION_SCHEMA
>;

export type TriggersFormValues = z.infer<typeof TRIGGER_SCHEMA>;

export type TransitionType = NonNullable<
  TwinFlowTransitionCreate["twinflowTransitionTypeId"]
>;

export const TRANSITION_TYPES: TransitionType[] = [
  "STATUS_CHANGE",
  "OPERATION",
  "OPERATION_DISABLE",
  "MARKETING",
  "STATUS_CHANGE_MARKETING",
] as const;

export const TransitionTypesEnum = createEnum<TransitionType>(TRANSITION_TYPES);
