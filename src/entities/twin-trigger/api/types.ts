import { Featurer } from "@/entities/featurer";
import { components } from "@/shared/api/generated/schema";

import { ExtendedFeaturerParam } from "../../../features/featurer/utils/helpers";

export type TwinTrigger = components["schemas"]["TwinTriggerV1"];

export type TwinTrigger_DETAILED = Required<TwinTrigger> & {
  triggerFeaturer?: Featurer;
  triggerDetailedParams?: ExtendedFeaturerParam[];
};

export type TwinTriggerSearchRq =
  components["schemas"]["TwinTriggerSearchRqV1"];

export type TwinTriggerFilterKeys =
  | "idList"
  | "triggerFeaturerIdList"
  | "active"
  | "nameLikeList";

export type TwinTriggerFilters = Partial<
  Pick<components["schemas"]["TwinTriggerSearchV1"], TwinTriggerFilterKeys>
>;
