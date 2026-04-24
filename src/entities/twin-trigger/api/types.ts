import { Featurer } from "@/entities/featurer";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { components } from "@/shared/api/generated/schema";

import { ExtendedFeaturerParam } from "../../../features/featurer/utils/helpers";

export type TwinTrigger = components["schemas"]["TwinTriggerV1"];

export type TwinTrigger_DETAILED = Required<TwinTrigger> & {
  triggerFeaturer?: Featurer;
  triggerDetailedParams?: ExtendedFeaturerParam[];
  jobTwinClass?: TwinClass_DETAILED;
};

export type TwinTriggerSearchRq =
  components["schemas"]["TwinTriggerSearchRqV1"];
export type TwinTriggerCreateRq =
  components["schemas"]["TwinTriggerCreateRqV1"];
export type TwinTriggerUpdateRq =
  components["schemas"]["TwinTriggerUpdateRqV1"];

export type TwinTriggerFilterKeys =
  | "idList"
  | "triggerFeaturerIdList"
  | "jobTwinClassIdList"
  | "active"
  | "nameLikeList";

export type TwinTriggerFilters = Partial<
  Pick<components["schemas"]["TwinTriggerSearchV1"], TwinTriggerFilterKeys>
>;
