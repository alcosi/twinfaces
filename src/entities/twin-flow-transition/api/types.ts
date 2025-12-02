import type { Factory } from "@/entities/factory";
import type { Permission } from "@/entities/permission";
import type { TwinFlow } from "@/entities/twin-flow";
import type { TwinStatus } from "@/entities/twin-status";
import type { User } from "@/entities/user";
import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinFlowTransition =
  components["schemas"]["TwinflowTransitionBaseV2"] & {
    srcTwinStatus?: TwinStatus;
    dstTwinStatus?: TwinStatus;
    permission?: Permission;
    createdByUser?: User;
    twinflow?: TwinFlow;
    inbuiltTwinFactory?: Factory;
  };
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
export type TwinTransitionPerformRq =
  components["schemas"]["TwinTransitionPerformRqV1"];

export type FaceWT001ButtonV1 = components["schemas"]["FaceWT001ColumnV1"];

export type TwinFlowTransitionFilterKeys =
  | "idList"
  | "nameLikeList"
  | "descriptionLikeList"
  | "twinflowIdList"
  | "aliasLikeList"
  | "srcStatusIdList"
  | "dstStatusIdList"
  | "permissionIdList"
  | "inbuiltTwinFactoryIdList";

export type TwinFlowTransitionFilters = Partial<
  Pick<
    components["schemas"]["TransitionSearchRqV1"],
    TwinFlowTransitionFilterKeys
  >
>;

export type TwinFlowTransitionTrigger =
  components["schemas"]["TransitionTriggerV1"];
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

export type TwinTransitionTriggerUpdate =
  components["schemas"]["TransitionTriggerUpdateRqV1"];
export type TwinTransitionTriggerCreate =
  components["schemas"]["TransitionTriggerCreateRqV1"];

export type TransitionAliasV1 = components["schemas"]["TransitionAliasV1"];

export type TransitionAliasFiltersKeys =
  | "idList"
  | "idExcludeList"
  | "aliasLikeList"
  | "aliasNotLikeList";

export type TransitionAliasFilters = Partial<
  Pick<
    components["schemas"]["TransitionAliasSearchRqV1"],
    TransitionAliasFiltersKeys
  >
>;

export type TransitionTriggersFiltersKeys =
  | "idList"
  | "idExcludeList"
  | "twinflowTransitionIdList"
  | "twinflowTransitionIdExcludeList"
  | "transitionTriggerFeaturerIdList"
  | "transitionTriggerFeaturerIdExcludeList"
  | "active";

export type TransitionTriggersFilters = Partial<
  Pick<
    components["schemas"]["TransitionTriggerSearchV1"],
    TransitionTriggersFiltersKeys
  >
>;
