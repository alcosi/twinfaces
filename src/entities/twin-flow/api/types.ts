import { TwinStatus } from "@/entities/twin-status";
import { User } from "@/entities/user";
import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinFlow = components["schemas"]["TwinflowBaseV1"] & {};
export type TwinFlow_DETAILED = RequireFields<
  TwinFlow,
  "id" | "name" | "twinClassId"
> & {
  initialStatus: TwinStatus;
  createdByUser: User;
};

export type TwinFlowFilterKeys =
  | "idList"
  | "twinClassIdMap"
  | "nameI18nLikeList"
  | "descriptionI18nLikeList"
  | "initialStatusIdList"
  | "createdByUserIdList";
export type TwinFlowFilters = Partial<
  Pick<components["schemas"]["TwinflowListRqV1"], TwinFlowFilterKeys>
>;

export type TwinFlowCreateRq = components["schemas"]["TwinflowCreateRqV1"];
export type TwinFlowUpdateRq = components["schemas"]["TwinflowUpdateRqV1"];
