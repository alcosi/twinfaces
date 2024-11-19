import { z } from "zod";
import { TWIN_FLOW_TRANSITION_SCHEMA } from "./constants";

export type TwinFlowTransitionFormValues = z.infer<
  typeof TWIN_FLOW_TRANSITION_SCHEMA
>;
