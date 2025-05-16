import { z } from "zod";

import { FIRST_ID_EXTRACTOR, FIRST_USER_ID_EXTRACTOR } from "@/shared/libs";

import { transformToTwinTags } from "./helpers";
import { StaticTwinFieldId, StaticTwinFieldKey } from "./types";

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
  "id",
  "twinClassId",
  "aliases",
  "tags",
  "markers",
] as const;
export const STATIC_TWIN_FIELD_IDS = [
  "00000000-0000-0000-0011-000000000003",
  "00000000-0000-0000-0011-000000000004",
  "00000000-0000-0000-0011-000000000005",
  "00000000-0000-0000-0011-000000000006",
  "00000000-0000-0000-0011-000000000007",
  "00000000-0000-0000-0011-000000000008",
  "00000000-0000-0000-0011-000000000009",
  "00000000-0000-0000-0011-000000000010",
  "00000000-0000-0000-0011-000000000011",
  "00000000-0000-0000-0011-000000000012",
  "00000000-0000-0000-0011-000000000013",
  "00000000-0000-0000-0011-000000000014",
  "00000000-0000-0000-0011-000000000015",
  "00000000-0000-0000-0011-000000000016",
] as const;

export const STATIC_TWIN_FIELD_KEY_TO_ID_MAP: Record<
  StaticTwinFieldKey,
  StaticTwinFieldId
> = {
  name: "00000000-0000-0000-0011-000000000003",
  description: "00000000-0000-0000-0011-000000000004",
  externalId: "00000000-0000-0000-0011-000000000005",
  ownerUserId: "00000000-0000-0000-0011-000000000006",
  assignerUserId: "00000000-0000-0000-0011-000000000007",
  authorUserId: "00000000-0000-0000-0011-000000000008",
  headTwinId: "00000000-0000-0000-0011-000000000009",
  statusId: "00000000-0000-0000-0011-000000000010",
  createdAt: "00000000-0000-0000-0011-000000000011",
  id: "00000000-0000-0000-0011-000000000012",
  twinClassId: "00000000-0000-0000-0011-000000000013",
  aliases: "00000000-0000-0000-0011-000000000014",
  tags: "00000000-0000-0000-0011-000000000015",
  markers: "00000000-0000-0000-0011-000000000016",
} as const;

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
