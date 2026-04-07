import { TwinFlowTransition_DETAILED } from "@/entities/twin-flow-transition";
import { TwinTrigger_DETAILED } from "@/entities/twin-trigger";
import { components } from "@/shared/api/generated/schema";

export type TransitionTrigger = components["schemas"]["TransitionTriggerV1"];

export type TransitionTrigger_DETAILED = Required<TransitionTrigger> & {
  twinTrigger?: TwinTrigger_DETAILED;
  twinflowTransition?: TwinFlowTransition_DETAILED;
};

export type TransitionTriggerSearchRq =
  components["schemas"]["TransitionTriggerSearchRqV1"];

export type TransitionTriggerFilterKeys =
  | "idList"
  | "twinflowTransitionIdList"
  | "twinTriggerIdList"
  | "active"
  | "async";

export type TransitionTriggerFilters = Partial<
  Pick<
    components["schemas"]["TransitionTriggerSearchV1"],
    TransitionTriggerFilterKeys
  >
>;

export type TransitionTriggerCreateRq =
  components["schemas"]["TransitionTriggerCreateRqV1"];
export type TransitionTriggerCreate =
  components["schemas"]["TransitionTriggerCreateV1"];

export type TransitionTriggerUpdateRq =
  components["schemas"]["TransitionTriggerUpdateRqV1"];
export type TransitionTriggerUpdate =
  components["schemas"]["TransitionTriggerUpdateV1"];
