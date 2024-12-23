import type { components } from "@/shared/api/generated/schema";
import { TwinClass_DETAILED } from "@/entities/twinClass";
import { Featurer_DETAILED } from "@/entities/featurer";

export type Fields = components["schemas"]["TwinClassFieldV2"];
export type Fields_DETAILED = Required<Fields> & {
  twinClass: TwinClass_DETAILED;
  fieldTyperFeaturer: Featurer_DETAILED;
};

export type FieldsFilterKeys =
  | "idList"
  | "twinClassIdList"
  | "keyLikeList"
  | "nameI18nLikeList"
  | "descriptionI18nLikeList"
  | "fieldTyperIdList"
  | "viewPermissionIdList"
  | "editPermissionIdList";

export type FieldsFilter = Partial<
  Pick<components["schemas"]["TwinClassFieldSearchRqV1"], FieldsFilterKeys>
>;
