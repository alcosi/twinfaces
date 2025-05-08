import { z } from "zod";

import { FIRST_ID_EXTRACTOR, FIRST_USER_ID_EXTRACTOR } from "@/shared/libs";

import { transformToTwinTags } from "./helpers";

export const TwinTouchIds = ["WATCHED", "STARRED", "REVIEWED"] as const;

export const TwinBasicFields = [
  "assigneeUserId",
  "createdByUserId",
  "name",
  "description",
] as const;

export const TWIN_SCHEMA = z.object({
  classId: FIRST_ID_EXTRACTOR,
  headTwinId: FIRST_ID_EXTRACTOR.optional(),
  name: z.string().min(1, "Name can not be empty"),
  assignerUserId: FIRST_USER_ID_EXTRACTOR,
  description: z.string().optional(),
  fields: z.record(z.string(), z.string().default("")).optional(),
  tags: z
    .array(
      z.union([
        z.object({ id: z.string().uuid(), name: z.string() }),
        z.string(),
      ])
    )
    .transform(transformToTwinTags)
    .optional(),
});

// === Twin fields ===
export const STATIC_TWIN_FIELD_KEYS = [
  "name",
  "description",
  "externalId",
  "ownerUserId",
  "assignerUserId",
  "authorUserId",
  "headTwinId",
  "statusId",
  "createdAt",
] as const;

export const FieldDescriptorText = {
  PLAIN: {
    fieldType: "textV1",
    editorType: "PLAIN",
    regExp: ".*",
  },
  MARKDOWN_GITHUB: {
    fieldType: "textV1",
    editorType: "MARKDOWN_GITHUB",
    regExp: "[\\s\\S]*",
  },
  MARKDOWN_BASIC: {
    fieldType: "textV1",
    editorType: "MARKDOWN_BASIC",
    regExp: "[\\s\\S]*",
  },
} as const;

export const FieldDescriptorSelectUserV1 = {
  fieldType: "selectUserV1",
  regExp: ".*",
} as const;

export const FieldDescriptorSelectSharedInHeadV1 = {
  fieldType: "selectSharedInHeadV1",
  regExp: ".*",
} as const;
// === Twin fields ===
