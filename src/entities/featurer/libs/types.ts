import { z } from "zod";
import { Featurer } from "../api";
import { FeaturerTypes } from "./constants";

export type FeaturerTypeId = (typeof FeaturerTypes)[keyof typeof FeaturerTypes];

export type FeaturerParamTypes =
  | "STRING"
  | "BOOLEAN"
  | "INT"
  | "WORD_LIST"
  | "DOUBLE"
  | "WORD_LIST:TWINS_TWIN_BASIC_FIELD"
  | "STRING:TWINS_TWIN_TOUCH_ID"
  | "UUID_SET:TWINS_USER_GROUP_ID"
  | "UUID:TWINS_PERMISSION_SCHEMA_ID"
  | "UUID:TWINS_TWIN_CLASS_SCHEMA_ID"
  | "UUID:TWINS_TWINFLOW_SCHEMA_ID"
  | "UUID:TWINS_TWIN_ID"
  | "UUID:TWINS_LINK_ID"
  | "UUID:TWINS_DATA_LIST_ID"
  | "UUID_SET:TWINS_TWIN_STATUS_ID"
  | "UUID:TWINS_TWIN_CLASS_FIELD_ID"
  | "UUID"
  | "UUID_SET:TWINS_TWIN_CLASS_ID"
  | "UUID:TWINS_TWIN_CLASS_ID"
  | "UUID:TWINS_TWIN_STATUS_ID"
  | "UUID:TWINS_MARKER_ID"
  | "UUID_SET:TWINS_TWIN_CLASS_FIELD_ID"
  | "UUID:TWINS_PERMISSION_ID"
  | "UUID_SET:TWINS_LINK_ID"
  | "STRING:TWINS_TWIN_BASIC_FIELD";

export type FeaturerParams = Record<
  string,
  {
    value: string;
    type: FeaturerParamTypes;
  }
>;

export interface FeaturerValue {
  featurer: Featurer;
  params: FeaturerParams;
}
