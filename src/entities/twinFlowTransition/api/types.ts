import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TF_Transition = components["schemas"]["TwinflowTransitionBaseV3"];
export type TF_Transition_SHORT = RequireFields<
  TF_Transition,
  "id" | "alias" | "name" | "allowAttachments" | "allowComment" | "allowLinks"
>;
export type TF_Transition_DETAILED = RequireFields<
  TF_Transition_SHORT,
  | "description"
  | "createdAt"
  | "createdByUserId"
  | "srcTwinStatusId"
  | "dstTwinStatusId"
  | "permissionId"
>;

export type TwinFlowTransitionCreateRq =
  components["schemas"]["TransitionCreateRqV1"];
export type TwinFlowTransitionUpdateRq =
  components["schemas"]["TransitionUpdateRqV1"];

export type TwinFlowTransitionApiFilterFields =
  | "twinflowIdList"
  | "aliasLikeList"
  | "srcStatusIdList"
  | "dstStatusIdList"
  | "permissionIdList";
export type TwinFlowTransitionApiFilters = Partial<
  Pick<
    components["schemas"]["TransitionSearchRqV1"],
    TwinFlowTransitionApiFilterFields
  >
>;

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
