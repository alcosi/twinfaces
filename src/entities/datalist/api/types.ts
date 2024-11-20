import { components } from "@/shared/api/generated/schema";

export type DataList = components["schemas"]["DataListV1"];
export type DataListOption = components["schemas"]["DataListOptionV1"];

export type DatalistFilterFields = "dataListIdList";

export type DatalistApiFilters = Partial<
  Pick<components["schemas"]["DataListSearchRqV1"], DatalistFilterFields>
>;
