import { components } from "@/shared/api/generated/schema";

export type DataListOptionV1 = components["schemas"]["DataListOptionV1"];
export type DataListOptionV3 = components["schemas"]["DataListOptionV3"];
export type DataListOptionCreateRqDV1 =
  components["schemas"]["DataListOptionCreateRqDV1"];
export type DataListOptionUpdateRqV1 =
  components["schemas"]["DataListOptionUpdateRqV1"];

export type DataListOptionFilterKeys =
  | "idList"
  | "dataListIdList"
  | "optionI18nLikeList"
  | "statusIdList";

export type DataListOptionFilters = Partial<
  Pick<
    components["schemas"]["DataListOptionSearchRqV1"],
    DataListOptionFilterKeys
  >
>;
