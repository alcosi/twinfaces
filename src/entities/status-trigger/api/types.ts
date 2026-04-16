import { TwinStatus } from "@/entities/twin-status";
import { TwinTrigger_DETAILED } from "@/entities/twin-trigger";
import { components } from "@/shared/api/generated/schema";

export type StatusTrigger = components["schemas"]["TwinStatusTriggerV1"];

export type StatusTrigger_DETAILED = Required<StatusTrigger> & {
  twinStatus?: TwinStatus;
  twinTrigger?: TwinTrigger_DETAILED;
};

export type StatusTriggerSearchRq =
  components["schemas"]["TwinStatusTriggerSearchRqV1"];

export type StatusTriggerFilterKeys =
  | "idList"
  | "twinStatusIdList"
  | "twinTriggerIdList"
  | "active"
  | "async"
  | "incomingElseOutgoing";

export type StatusTriggerFilters = Partial<
  Pick<
    components["schemas"]["TwinStatusTriggerSearchV1"],
    StatusTriggerFilterKeys
  >
>;

export type StatusTriggerCreateRq =
  components["schemas"]["TwinStatusTriggerCreateRqV1"];
export type StatusTriggerCreate =
  components["schemas"]["TwinStatusTriggerCreateV1"];

export type StatusTriggerUpdateRq =
  components["schemas"]["TwinStatusTriggerUpdateRqV1"];
export type StatusTriggerUpdate =
  components["schemas"]["TwinStatusTriggerUpdateV1"];
