import { components } from "@/shared/api/generated/schema";

export type DataList = components["schemas"]["DataListV1"];
export type DataListOption = components["schemas"]["DataListOptionV1"];

export type DatalistFilterFields =
  | "idList"
  | "nameLikeList"
  | "descriptionLikeList"
  | "keyLikeList";

export type DatalistApiFilters = Partial<
  Pick<components["schemas"]["DataListSearchRqV1"], DatalistFilterFields>
>;

export type DataListOptionMap = {
  [key: string]: components["schemas"]["DataListOptionV1"];
};
export type DataListV1 = components["schemas"]["DataListV1"];
export type DataListsMap = {
  [key: string]: components["schemas"]["DataListV1"];
};
