import { components } from "@/shared/api/generated/schema";

export type DataListOptionV3 = components["schemas"]["DataListOptionV3"];

export type DataListOptionFilterKeys =
  | "idList"
  // | "idExcludeList"
  | "dataListIdList"
  // | "dataListIdExcludeList"
  // | "dataListKeyList"
  // | "dataListKeyExcludeList"
  // | "optionLikeList"
  // | "optionNotLikeList"
  | "optionI18nLikeList";
// | "optionI18nNotLikeList"
// | "businessAccountIdList"
// | "businessAccountIdExcludeList"
// | "dataListSubsetIdList"
// | "dataListSubsetIdExcludeList"
// | "dataListSubsetKeyList"
// | "dataListSubsetKeyExcludeList"

export type DataListOptionFilters = Partial<
  Pick<
    components["schemas"]["DataListOptionSearchRqV1"],
    DataListOptionFilterKeys
  >
>;
