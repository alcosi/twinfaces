import { BusinessAccount } from "@/entities/business-account";
import { TwinStatus } from "@/entities/twin-status";
import { TwinTrigger_DETAILED } from "@/entities/twin-trigger";
import { Twin_DETAILED } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { components } from "@/shared/api/generated/schema";

export type TriggerTask = components["schemas"]["TwinTriggerTaskV1"];

export type TriggerTask_DETAILED = Required<TriggerTask> & {
  twin?: Twin_DETAILED;
  twinTrigger?: TwinTrigger_DETAILED;
  createdByUser?: User;
  businessAccount?: BusinessAccount;
  previousTwinStatus?: TwinStatus;
};

export type TriggerTaskSearchRq =
  components["schemas"]["TwinTriggerTaskSearchV1"];

export type TriggerTaskFilterKeys =
  | "idList"
  | "twinIdList"
  | "twinTriggerIdList"
  | "previousTwinStatusIdList"
  | "createdByUserIdList"
  | "businessAccountIdList"
  | "statusIdList";

export type TriggerTaskFilters = Partial<
  Pick<TriggerTaskSearchRq, TriggerTaskFilterKeys>
>;
