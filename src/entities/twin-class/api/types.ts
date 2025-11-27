import { Permission } from "@/entities/permission";
import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinClass = components["schemas"]["TwinClassV1"];

export type TwinClassBaseV1 = components["schemas"]["TwinClassBaseV1"];
export type TwinClass_SHORT = RequireFields<TwinClass, "id" | "key">;
export type TwinClass_DETAILED = RequireFields<
  TwinClass,
  | "id"
  | "key"
  | "name"
  | "description"
  | "createdAt"
  | "abstractClass"
  | "markersDataListId"
  | "tagsDataListId"
> & {
  createPermission: Permission;
  viewPermission: Permission;
  editPermission: Permission;
  deletePermission: Permission;
  headClass: TwinClassBaseV1;
  hasSegment: boolean;
  segment: boolean;
  twinClassFreeze?: TwinClassBaseV1;
};
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

export type TwinClassFiltersHierarchyOverride = {
  idList: string[];
  depth: number;
};

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
  | "headHierarchyParentsForTwinClassSearch"
  | "extendsHierarchyParentsForTwinClassSearch"
  | "extendsHierarchyChildsForTwinClassSearch"
  | "ownerTypeList"
  | "abstractt"
  | "twinflowSchemaSpace"
  | "twinClassSchemaSpace"
  | "permissionSchemaSpace"
  | "aliasSpace"
  | "viewPermissionIdList"
  | "createPermissionIdList"
  | "editPermissionIdList"
  | "deletePermissionIdList"
  | "markerDatalistIdList"
  | "tagDatalistIdList"
  | "headHierarchyChildsForTwinClassSearch"
  | "hasSegments"
  | "segment"
  | "assigneeRequired"
  | "externalIdLikeList";

export type TwinClassFilters = Partial<
  Pick<components["schemas"]["TwinClassSearchV1"], TwinClassFilterKeys>
>;

export type TwinClassListRs = components["schemas"]["TwinClassListRsV1"];

export type TagSearchFilterKeys =
  | "idList"
  | "idExcludeList"
  | "optionLikeList"
  | "optionNotLikeList"
  | "optionI18nLikeList"
  | "optionI18nNotLikeList";

export type TagSearchFilters = Partial<
  Pick<components["schemas"]["TagSearchRqV1"], TagSearchFilterKeys>
>;
