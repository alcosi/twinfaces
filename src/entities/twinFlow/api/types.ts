import { components } from "@/shared/api/generated/schema";

export type TwinFlow = components["schemas"]["TwinflowBaseV3"];
export type TwinFlowCreateRq = components["schemas"]["TwinflowCreateRqV1"];
export type TwinFlowUpdateRq = components["schemas"]["TwinflowUpdateRqV1"];

// TwinFlowTransition
export type TwinFlowTransition =
  components["schemas"]["TwinflowTransitionBaseV3"];
export type TwinFlowTransitionCreateRq =
  components["schemas"]["TransitionCreateRqV1"];
export type TwinFlowTransitionUpdateRq =
  components["schemas"]["TransitionUpdateRqV1"];
export type TwinFlowTransitionTrigger = components["schemas"]["TriggerV1"];
export type TwinFlowTransitionTriggerCud =
  components["schemas"]["TriggerCudV1"];
export type TwinFlowTransitionTriggerUpdate =
  components["schemas"]["TriggerUpdateV1"];
export type TwinFlowTransitionValidator =
  components["schemas"]["TransitionValidatorRuleBaseV1"];
export type TwinFlowTransitionValidatorCud =
  components["schemas"]["ValidatorCudV1"];
export type TwinFlowTransitionValidatorUpdate =
  components["schemas"]["ValidatorUpdateV1"];
