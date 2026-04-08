import type { Factory } from "@/entities/factory";
import { Featurer_DETAILED } from "@/entities/featurer";
import type { Permission } from "@/entities/permission";
import type { TwinFlow } from "@/entities/twin-flow";
import type { TwinStatus } from "@/entities/twin-status";
import type { User } from "@/entities/user";
import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

import { ExtendedFeaturerParam } from "../../../features/featurer/utils/helpers";

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

export type TwinFlowTransitionCreate =
  components["schemas"]["TransitionCreateV1"];
export type TwinFlowTransitionUpdate =
  components["schemas"]["TransitionUpdateV1"];

export type FaceWT001ButtonV1 = components["schemas"]["FaceWT001ColumnV1"];

export type TwinFlowTransitionFilterKeys =
  | "idList"
  | "nameLikeList"
  | "twinflowTransitionTypeList"
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
export type TwinFlowTransitionTrigger_DETAILED =
  components["schemas"]["TransitionTriggerV1"] & {
    twinflowTransition?: TwinFlowTransition_DETAILED;
    triggerFeaturer?: Featurer_DETAILED;
    transitionTriggerDetailedParams?: ExtendedFeaturerParam[];
  };

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
