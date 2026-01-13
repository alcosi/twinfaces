import { components } from "@/shared/api/generated/schema";

export type TwinClassFreeze = components["schemas"]["TwinClassFreezeV1"];

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
