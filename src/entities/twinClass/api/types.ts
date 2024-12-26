import { components, paths } from "@/shared/api/generated/schema";

export type TwinClass = components["schemas"]["TwinClassV1"];
export type TwinClassCreateRq = components["schemas"]["TwinClassCreateRqV1"];
export type TwinClassUpdateRq = components["schemas"]["TwinClassUpdateRqV1"];

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
  | "aliasSpace"
  | "viewPermissionIdList";

export type TwinClassFilters = Partial<
  Pick<components["schemas"]["TwinClassListRqV1"], TwinClassFilterKeys>
>;
