import { Featurer_DETAILED } from "@/entities/featurer";
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

export type TwinClassFieldV2 = components["schemas"]["TwinClassFieldV2"];
export type TwinClassFieldV2_DETAILED = Required<TwinClassFieldV2> & {
  twinClass: TwinClass_DETAILED;
  fieldTyperFeaturer: Featurer_DETAILED;
};

export type TwinClassFieldV2FilterKeys =
  | "idList"
  | "twinClassIdMap"
  | "keyLikeList"
  | "nameI18nLikeList"
  | "descriptionI18nLikeList"
  | "fieldTyperIdList"
  | "viewPermissionIdList"
  | "editPermissionIdList";

export type TwinClassFieldV2Filters = Partial<
  Pick<
    components["schemas"]["TwinClassFieldSearchRqV1"],
    TwinClassFieldV2FilterKeys
  >
>;
