import { Featurer } from "../api";

export const FeaturerTypes = {
  fieldTyper: 13,
  trigger: 15,
  validator: 16,
  headHunter: 26,
  filler: 23,
} as const;

export type FeaturerTypeId = (typeof FeaturerTypes)[keyof typeof FeaturerTypes];

export enum FeaturerParamType {
  STRING = "STRING",
  BOOLEAN = "BOOLEAN",
  INT = "INT",
  WORD_LIST = "WORD_LIST",
  DOUBLE = "DOUBLE",
  WORD_LIST_TWINS_TWIN_BASIC_FIELD = "WORD_LIST:TWINS:TWIN_BASIC_FIELD",
  STRING_TWINS_TWIN_TOUCH_ID = "STRING:TWINS:TWIN_TOUCH_ID",
  UUID_SET_TWINS_USER_GROUP_ID = "UUID_SET:TWINS:USER_GROUP_ID",
  UUID_TWINS_PERMISSION_SCHEMA_ID = "UUID:TWINS:PERMISSION_SCHEMA_ID",
  UUID_TWINS_TWIN_CLASS_SCHEMA_ID = "UUID:TWINS:TWIN_CLASS_SCHEMA_ID",
  UUID_TWINS_TWINFLOW_SCHEMA_ID = "UUID:TWINS:TWINFLOW_SCHEMA_ID",
  UUID_TWINS_TWIN_ID = "UUID:TWINS:TWIN_ID",
  UUID_TWINS_LINK_ID = "UUID:TWINS:LINK_ID",
  UUID_TWINS_DATA_LIST_ID = "UUID:TWINS:DATA_LIST_ID",
  UUID_SET_TWINS_TWIN_STATUS_ID = "UUID_SET:TWINS:TWIN_STATUS_ID",
  UUID_TWINS_TWIN_CLASS_FIELD_ID = "UUID:TWINS:TWIN_CLASS_FIELD_ID",
  UUID = "UUID",
  UUID_SET_TWINS_TWIN_CLASS_ID = "UUID_SET:TWINS:TWIN_CLASS_ID",
  UUID_TWINS_TWIN_CLASS_ID = "UUID:TWINS:TWIN_CLASS_ID",
  UUID_TWINS_TWIN_STATUS_ID = "UUID:TWINS:TWIN_STATUS_ID",
  UUID_TWINS_MARKER_ID = "UUID:TWINS:MARKER_ID",
  UUID_SET_TWINS_TWIN_CLASS_FIELD_ID = "UUID_SET:TWINS_TWIN_CLASS_FIELD_ID",
  UUID_TWINS_PERMISSION_ID = "UUID:TWINS:PERMISSION_ID",
  UUID_SET_TWINS_LINK_ID = "UUID_SET:TWINS:LINK_ID",
  STRING_TWINS_TWIN_BASIC_FIELD = "STRING:TWINS:TWIN_BASIC_FIELD",
}

export type FeaturerParamValue = string | string[] | boolean | number;

export type FeaturerParams = Record<
  string,
  {
    value: FeaturerParamValue;
    type: FeaturerParamType;
  }
>;

export interface FeaturerValue {
  featurer: Featurer;
  params: FeaturerParams;
}

export function getDefaultFeaturerParamValue(type: FeaturerParamType) {
  switch (type) {
    case FeaturerParamType.BOOLEAN:
      return false;
    case FeaturerParamType.INT:
      return 0;
    case FeaturerParamType.DOUBLE:
      return 0.0;

    default:
      if (type.startsWith("UUID_SET") || type.startsWith("WORD_LIST")) {
        return [] as string[];
      }
      return "";
  }
}
