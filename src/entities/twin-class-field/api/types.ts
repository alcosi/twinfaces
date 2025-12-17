import { Featurer_DETAILED } from "@/entities/featurer";
import { Permission_DETAILED } from "@/entities/permission";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

// TODO: Unify TwinClassFieldV1 & TwinClassFieldV2
export type TwinClassField = components["schemas"]["TwinClassFieldV1"];
export type TwinClassField_DETAILED = RequireFields<
  TwinClassField,
  "id" | "key" | "name" | "twinClassId"
>;

export type TwinClassFieldSearchFilterKeys = "twinClassIdMap" | "keyLikeList";
export type TwinClassFieldSearchFilters = Partial<
  Pick<
    components["schemas"]["TwinClassFieldSearchRqV1"],
    TwinClassFieldSearchFilterKeys
  >
>;

export type TwinClassFieldCreateRq =
  components["schemas"]["TwinClassFieldCreateRqV1"];
export type TwinClassFieldUpdateRq =
  components["schemas"]["TwinClassFieldUpdateRqV1"];

export type TwinClassFieldV1_DETAILED = Required<TwinClassField> & {
  twinClass: TwinClass_DETAILED;
  fieldTyperFeaturer: Featurer_DETAILED;
  viewPermission: Permission_DETAILED;
  editPermission: Permission_DETAILED;
  projectionField: boolean;
  hasProjectedFields: boolean;
  twinSorterFeaturer: Featurer_DETAILED;
};

export type TwinClassFieldV2FilterKeys =
  | "idList"
  | "twinClassIdMap"
  | "keyLikeList"
  | "nameI18nLikeList"
  | "descriptionI18nLikeList"
  | "fieldTyperIdList"
  | "twinSorterIdList"
  | "viewPermissionIdList"
  | "editPermissionIdList"
  | "required"
  | "system"
  | "dependentField"
  | "hasDependentFields"
  | "projectionField"
  | "hasProjectionFields";

export type TwinClassFieldV2Filters = Partial<
  components["schemas"]["TwinClassFieldSearchV1"]
>;

export type TwinClassFieldSearchRsV1 =
  components["schemas"]["TwinClassFieldSearchRsV1"];
