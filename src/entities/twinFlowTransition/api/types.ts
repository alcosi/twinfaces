import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinFlowTransition =
  components["schemas"]["TwinflowTransitionBaseV3"];
export type TwinFlowTransition_SHORT = RequireFields<
  TwinFlowTransition,
  "id" | "alias" | "name" | "allowAttachments" | "allowComment" | "allowLinks"
>;
export type TwinFlowTransition_DETAILED = RequireFields<
  TwinFlowTransition_SHORT,
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

export type TwinFlowTransitionFilterKeys =
  | "twinflowIdList"
  | "aliasLikeList"
  | "srcStatusIdList"
  | "dstStatusIdList"
  | "permissionIdList";
export type TwinFlowTransitionFilters = Partial<
  Pick<
    components["schemas"]["TransitionSearchRqV1"],
    TwinFlowTransitionFilterKeys
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
export type TwinFlowTransitionValidatorCreate =
  components["schemas"]["ValidatorCreateV1"];
export type TwinFlowTransitionValidatorUpdate =
  components["schemas"]["ValidatorUpdateV1"];
