import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type Twin = components["schemas"]["TwinV2"];
export type Twin_SHORT = RequireFields<
  Twin,
  | "id"
  | "name"
  | "assignerUserId"
  | "authorUserId"
  | "markerIdList"
  | "statusId"
  | "tagIdList"
  | "twinClassId"
>;
export type Twin_DETAILED = RequireFields<
  Twin_SHORT,
  "createdAt" | "headTwinId"
>;

export type TwinUpdateRq = components["schemas"]["TwinUpdateRqV1"];
export type TwinLinkView = components["schemas"]["TwinLinkViewV1"];
export type TwinLinkAddRqV1 = components["schemas"]["TwinLinkAddRqV1"];
export type HistoryV1 = components["schemas"]["HistoryV1"];

export type TwinFilterKeys =
  | "twinIdList"
  | "twinNameLikeList"
  | "twinClassIdList"
  | "statusIdList"
  | "createdByUserIdList"
  | "assignerUserIdList"
  | "headTwinIdList"
  | "tagDataListOptionIdList"
  | "markerDataListOptionIdList";

export type TwinFilters = Partial<
  Pick<components["schemas"]["TwinSearchRqV1"], TwinFilterKeys>
>;
