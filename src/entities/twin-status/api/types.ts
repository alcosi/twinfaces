import { components } from "@/shared/api/generated/schema";

export type TwinStatusV2 = components["schemas"]["TwinStatusV2"];
export type TwinStatus_DETAILED = Required<TwinStatusV2>;

export type TwinStatusCreateRq = components["schemas"]["TwinStatusCreateRqV1"];
export type TwinStatusUpdateRq = components["schemas"]["TwinStatusUpdateRqV1"];

export type TwinStatusFilterKeys =
  | "idList"
  | "twinClassIdList"
  | "keyLikeList"
  | "nameI18nLikeList"
  | "descriptionI18nLikeList";

export type TwinStatusFilters = Partial<
  Pick<components["schemas"]["TwinStatusSearchRqV1"], TwinStatusFilterKeys>
>;
