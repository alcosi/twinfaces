import { components } from "@/shared/api/generated/schema";

export type DataListOptionV3 = components["schemas"]["DataListOptionV3"];
export type DataListOptionV1 = components["schemas"]["DataListOptionV1"];

export type DataListOptionFilterKeys =
  | "idList"
  | "optionI18nLikeList"
  | "dataListIdList";

export type DataListOptionFilters = Partial<
  Pick<
    components["schemas"]["DataListOptionSearchRqV1"],
    DataListOptionFilterKeys
  >
>;
