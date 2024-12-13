import { components } from "@/shared/api/generated/schema";

export type DataList = components["schemas"]["DataListV2"];
export type DataListOption = components["schemas"]["DataListOptionV1"];

export type DatalistFilterKeys =
  | "idList"
  | "nameLikeList"
  | "descriptionLikeList"
  | "keyLikeList";

export type DatalistFilters = Partial<
  Pick<components["schemas"]["DataListSearchRqV1"], DatalistFilterKeys>
>;

export type DataListOptionMap = {
  [key: string]: components["schemas"]["DataListOptionV1"];
};
// export type DataListV1 = components["schemas"]["DataListV1"];
export type DataListsMap = {
  [key: string]: components["schemas"]["DataListV1"];
};
