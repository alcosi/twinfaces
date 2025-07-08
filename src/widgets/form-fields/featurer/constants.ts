import { ZodType, z } from "zod";

import {
  FeaturerParamType,
  UUID_SCHEMA,
  UUID_SET_SCHEMA,
} from "@/entities/featurer";

export const ParamTypeSchemaMap: Record<FeaturerParamType, ZodType<unknown>> = {
  [FeaturerParamType.BOOLEAN]: z.boolean(),
  [FeaturerParamType.DOUBLE]: z.number().multipleOf(0.01),
  [FeaturerParamType.INT]: z.number().int(),
  [FeaturerParamType.STRING]: z.string(),
  [FeaturerParamType.UUID]: UUID_SCHEMA,
  [FeaturerParamType.WORD_LIST]: z.array(z.string()),
  [FeaturerParamType.STRING_TWINS_TWIN_BASIC_FIELD]: z.string(),
  [FeaturerParamType.STRING_TWINS_TWIN_TOUCH_ID]: UUID_SCHEMA,
  [FeaturerParamType.UUID_TWINS_DATA_LIST_ID]: UUID_SCHEMA,
  [FeaturerParamType.UUID_TWINS_LINK_ID]: UUID_SCHEMA,
  [FeaturerParamType.UUID_TWINS_MARKER_ID]: UUID_SCHEMA,
  [FeaturerParamType.UUID_TWINS_PERMISSION_ID]: UUID_SCHEMA,
  [FeaturerParamType.UUID_TWINS_PERMISSION_SCHEMA_ID]: UUID_SCHEMA,
  [FeaturerParamType.UUID_TWINS_TWIN_CLASS_FIELD_ID]: UUID_SCHEMA,
  [FeaturerParamType.UUID_TWINS_TWIN_CLASS_ID]: UUID_SCHEMA,
  [FeaturerParamType.UUID_TWINS_TWIN_CLASS_SCHEMA_ID]: UUID_SCHEMA,
  [FeaturerParamType.UUID_TWINS_TWINFLOW_SCHEMA_ID]: UUID_SCHEMA,
  [FeaturerParamType.UUID_TWINS_TWIN_ID]: UUID_SCHEMA,
  [FeaturerParamType.UUID_TWINS_TWIN_STATUS_ID]: UUID_SCHEMA,
  [FeaturerParamType.UUID_SET_TWINS_LINK_ID]: z.array(UUID_SCHEMA),
  [FeaturerParamType.UUID_SET_TWINS_TWIN_CLASS_FIELD_ID]: UUID_SET_SCHEMA,
  [FeaturerParamType.UUID_SET_TWINS_TWIN_CLASS_ID]: UUID_SET_SCHEMA,
  [FeaturerParamType.UUID_SET_TWINS_TWIN_STATUS_ID]: UUID_SET_SCHEMA,
  [FeaturerParamType.UUID_SET_TWINS_USER_GROUP_ID]: UUID_SET_SCHEMA,
  [FeaturerParamType.WORD_LIST_TWINS_TWIN_BASIC_FIELD]: z.array(z.string()),
} as const;
