import { z } from "zod";
import { FeaturerParamTypes } from "./types";

export const ENTITY_COLOR = "#0EA5E9";

export const FeaturerTypes = {
  fieldTyper: 13,
  trigger: 15,
  validator: 16,
  headHunter: 26,
} as const;

export const ParamTypes: Record<FeaturerParamTypes, FeaturerParamTypes> = {
  BOOLEAN: "BOOLEAN",
  STRING: "STRING",
  INT: "INT",
  WORD_LIST: "WORD_LIST",
  DOUBLE: "DOUBLE",
  "WORD_LIST:TWINS_TWIN_BASIC_FIELD": "WORD_LIST:TWINS_TWIN_BASIC_FIELD",
  "STRING:TWINS_TWIN_TOUCH_ID": "STRING:TWINS_TWIN_TOUCH_ID",
  "UUID_SET:TWINS_USER_GROUP_ID": "UUID_SET:TWINS_USER_GROUP_ID",
  "UUID:TWINS_PERMISSION_SCHEMA_ID": "UUID:TWINS_PERMISSION_SCHEMA_ID",
  "UUID:TWINS_TWIN_CLASS_SCHEMA_ID": "UUID:TWINS_TWIN_CLASS_SCHEMA_ID",
  "UUID:TWINS_TWINFLOW_SCHEMA_ID": "UUID:TWINS_TWINFLOW_SCHEMA_ID",
  "UUID:TWINS_TWIN_ID": "UUID:TWINS_TWIN_ID",
  "UUID:TWINS_LINK_ID": "UUID:TWINS_LINK_ID",
  "UUID:TWINS_DATA_LIST_ID": "UUID:TWINS_DATA_LIST_ID",
  "UUID_SET:TWINS_TWIN_STATUS_ID": "UUID_SET:TWINS_TWIN_STATUS_ID",
  "UUID:TWINS_TWIN_CLASS_FIELD_ID": "UUID:TWINS_TWIN_CLASS_FIELD_ID",
  UUID: "UUID",
  "UUID_SET:TWINS_TWIN_CLASS_ID": "UUID_SET:TWINS_TWIN_CLASS_ID",
  "UUID:TWINS_TWIN_CLASS_ID": "UUID:TWINS_TWIN_CLASS_ID",
  "UUID:TWINS_TWIN_STATUS_ID": "UUID:TWINS_TWIN_STATUS_ID",
  "UUID:TWINS_MARKER_ID": "UUID:TWINS_MARKER_ID",
  "UUID_SET:TWINS_TWIN_CLASS_FIELD_ID": "UUID_SET:TWINS_TWIN_CLASS_FIELD_ID",
  "UUID:TWINS_PERMISSION_ID": "UUID:TWINS_PERMISSION_ID",
  "UUID_SET:TWINS_LINK_ID": "UUID_SET:TWINS_LINK_ID",
  "STRING:TWINS_TWIN_BASIC_FIELD": "STRING:TWINS_TWIN_BASIC_FIELD",
} as const;

export const FEATURER_FIELD_SCHEMA = z.object({
  id: z.number().optional(),
  params: z
    .record(
      z.object({
        value: z.string(),
        type: z.enum(
          Object.values(ParamTypes) as [
            FeaturerParamTypes,
            ...FeaturerParamTypes[],
          ]
        ),
      })
    )
    .optional(),
});

export const UUID_SCHEMA = z.string().uuid("Please enter a valid UUID");
export const UUID_SET_SCHEMA = z.array(UUID_SCHEMA);
