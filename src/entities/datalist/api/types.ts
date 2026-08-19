import { DataListOptionV1 } from "@/entities/datalist-option";
import { components, operations } from "@/shared/api/generated/schema";

export type DataList = components["schemas"]["DataListV1"];

export type DataListRqQuery =
  operations["dataListViewV1"]["parameters"]["query"];

export type DataListSearchRq = components["schemas"]["DataListSearchRqV2"];
/** Inner payload of a search request — filters live under its `search` key. */
export type DataListSearch = components["schemas"]["DataListSearchV1"];
export type DataListCreateRqV1 = components["schemas"]["DataListCreateRqV1"];
export type DataListUpdateRqV1 = components["schemas"]["DataListUpdateRqV1"];

export type DataListAttribute = {
  index: string;
  name: string;
  key: string;
};

export type DatalistFilterKeys =
  | "idList"
  | "nameLikeList"
  | "descriptionLikeList"
  | "keyLikeList";

export type DatalistFilters = Partial<Pick<DataListSearch, DatalistFilterKeys>>;

export type DataListOptionMap = {
  [key: string]: DataListOptionV1;
};
// export type DataListV1 = components["schemas"]["DataListV1"];
export type DataListsMap = {
  [key: string]: components["schemas"]["DataListV1"];
};
