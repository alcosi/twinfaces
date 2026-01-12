import { TwinStatus_DETAILED } from "@/entities/twin-status";
import { components } from "@/shared/api/generated/schema";

export type TwinClassFreeze = components["schemas"]["TwinClassFreezeV1"];

export type TwinClassFreeze_DETAILED = Required<TwinClassFreeze> & {
  status: TwinStatus_DETAILED;
};

export type TwinClassFreezeFilterKeys =
  | "idList"
  | "idExcludeList"
  | "keyLikeList"
  | "keyNotLikeList"
  | "statusIdList"
  | "statusIdExcludeList"
  | "nameLikeList"
  | "nameNotLikeList"
  | "descriptionLikeList"
  | "descriptionNotLikeList";

export type TwinClassFreezeFilters = Partial<
  Pick<
    components["schemas"]["TwinClassFreezeSearchV1"],
    TwinClassFreezeFilterKeys
  >
>;

export type QueryTwinClassFreezeViewV1 = {
  showTwinClassFreezeMode?: "HIDE" | "SHORT" | "DETAILED";
  showTwinClassFreeze2StatusMode?: "HIDE" | "SHORT" | "DETAILED";
};
