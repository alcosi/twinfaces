import { DataListOptionV1 } from "@/entities/datalist-option";
import { components, operations } from "@/shared/api/generated/schema";

export type DataList = components["schemas"]["DataListV2"];

export type DataListRqQuery =
  operations["dataListPublicViewV1"]["parameters"]["query"];

export type DataListSearchRqV1 = components["schemas"]["DataListSearchRqV1"];
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

export type DatalistFilters = Partial<
  Pick<components["schemas"]["DataListSearchRqV1"], DatalistFilterKeys>
>;

export type DataListOptionMap = {
  [key: string]: DataListOptionV1;
};
// export type DataListV1 = components["schemas"]["DataListV1"];
export type DataListsMap = {
  [key: string]: components["schemas"]["DataListV1"];
};
