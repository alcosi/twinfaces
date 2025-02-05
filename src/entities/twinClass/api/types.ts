import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinClass = components["schemas"]["TwinClassV1"];
export type TwinClass_SHORT = RequireFields<TwinClass, "id" | "key">;
export type TwinClass_DETAILED = RequireFields<
  TwinClass,
  | "logo"
  | "id"
  | "key"
  | "name"
  | "description"
  | "createdAt"
  | "abstractClass"
  | "markersDataListId"
  | "tagsDataListId"
  | "viewPermission"
  | "createPermission"
  | "editPermission"
  | "deletePermission"
>;
export type TwinClass_MANAGED = RequireFields<
  TwinClass,
  | "id"
  | "key"
  | "name"
  | "description"
  | "createdAt"
  | "abstractClass"
  | "aliasSpace"
  | "ownerType"
  | "permissionSchemaSpace"
  | "twinClassSchemaSpace"
  | "twinflowSchemaSpace"
>;

export type TwinClassCreateRq = components["schemas"]["TwinClassCreateRqV1"];
export type TwinClassUpdateRq = components["schemas"]["TwinClassUpdateRqV1"];

export type TwinClassValidHeadQuery =
  operations["validHeadV1"]["parameters"]["query"];
export type TwinClassValidHeadFilterKeys = "nameLike" | "aliasLike";
export type TwinClassValidHeadFilters = Partial<
  Pick<
    components["schemas"]["TwinSearchSimpleV1"],
    TwinClassValidHeadFilterKeys
  >
>;

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
  | "viewPermissionIdList"
  | "createPermissionIdList"
  | "editPermissionIdList"
  | "deletePermissionIdList";

export type TwinClassFilters = Partial<
  Pick<components["schemas"]["TwinClassListRqV1"], TwinClassFilterKeys>
>;
