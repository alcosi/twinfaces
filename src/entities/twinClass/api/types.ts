import { components, paths } from "@/shared/api/generated/schema";

export type TwinClass = components["schemas"]["TwinClassV1"];
export type TwinClassCreateRq =
  paths["/private/twin_class/v1"]["post"]["requestBody"]["content"]["application/json"];
export type TwinClassUpdateRq = components["schemas"]["TwinClassUpdateRqV1"];

export type DataListOptionMap = {
  [key: string]: components["schemas"]["DataListOptionV1"];
};
export type DataListV1 = components["schemas"]["DataListV1"];
export type DataListsMap = {
  [key: string]: components["schemas"]["DataListV1"];
};
export type DataListOption = components["schemas"]["DataListOptionV1"];

export type TwinClassFilterKeys =
  | "twinClassIdList"
  | "twinClassKeyLikeList"
  | "nameI18nLikeList"
  | "descriptionI18nLikeList"
  | "headTwinClassIdList"
  | "extendsTwinClassIdList"
  | "ownerTypeList"
  | "abstractt"
  | "twinflowSchemaSpace"
  | "twinClassSchemaSpace"
  | "permissionSchemaSpace"
  | "aliasSpace";

export type TwinClassFilters = Partial<
  Pick<components["schemas"]["TwinClassListRqV1"], TwinClassFilterKeys>
>;
