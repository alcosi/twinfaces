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
  WORD_LIST_TWINS_TWIN_BASIC_FIELD = "WORD_LIST:TWINS_TWIN_BASIC_FIELD",
  STRING_TWINS_TWIN_TOUCH_ID = "STRING:TWINS_TWIN_TOUCH_ID",
  UUID_SET_TWINS_USER_GROUP_ID = "UUID_SET:TWINS_USER_GROUP_ID",
  UUID_TWINS_PERMISSION_SCHEMA_ID = "UUID:TWINS_PERMISSION_SCHEMA_ID",
  UUID_TWINS_TWIN_CLASS_SCHEMA_ID = "UUID:TWINS_TWIN_CLASS_SCHEMA_ID",
  UUID_TWINS_TWINFLOW_SCHEMA_ID = "UUID:TWINS_TWINFLOW_SCHEMA_ID",
  UUID_TWINS_TWIN_ID = "UUID:TWINS_TWIN_ID",
  UUID_TWINS_LINK_ID = "UUID:TWINS_LINK_ID",
  UUID_TWINS_DATA_LIST_ID = "UUID:TWINS_DATA_LIST_ID",
  UUID_SET_TWINS_TWIN_STATUS_ID = "UUID_SET:TWINS_TWIN_STATUS_ID",
  UUID_TWINS_TWIN_CLASS_FIELD_ID = "UUID:TWINS_TWIN_CLASS_FIELD_ID",
  UUID = "UUID",
  UUID_SET_TWINS_TWIN_CLASS_ID = "UUID_SET:TWINS_TWIN_CLASS_ID",
  UUID_TWINS_TWIN_CLASS_ID = "UUID:TWINS_TWIN_CLASS_ID",
  UUID_TWINS_TWIN_STATUS_ID = "UUID:TWINS_TWIN_STATUS_ID",
  UUID_TWINS_MARKER_ID = "UUID:TWINS_MARKER_ID",
  UUID_SET_TWINS_TWIN_CLASS_FIELD_ID = "UUID_SET:TWINS_TWIN_CLASS_FIELD_ID",
  UUID_TWINS_PERMISSION_ID = "UUID:TWINS_PERMISSION_ID",
  UUID_SET_TWINS_LINK_ID = "UUID_SET:TWINS_LINK_ID",
  STRING_TWINS_TWIN_BASIC_FIELD = "STRING:TWINS_TWIN_BASIC_FIELD",
}

export type FeaturerParams = Record<
  string,
  {
    value: string;
    type: FeaturerParamType;
  }
>;

export interface FeaturerValue {
  featurer: Featurer;
  params: FeaturerParams;
}
