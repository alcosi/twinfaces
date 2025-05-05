import { toArray, toArrayOfString, wrapWithPercent } from "@/shared/libs";

import {
  DynamicFieldType,
  TwinFieldSearchDate,
  TwinFieldSearchList,
  TwinFieldSearchNumeric,
  TwinFieldSearchText,
  TwinFieldValue,
} from "./types";

// TODO: @berdimyradov move to types solving import loop error
export type StaticTwinFieldKey = (typeof STATIC_TWIN_FIELD_KEYS)[number];
export type StaticTwinFieldId = (typeof STATIC_TWIN_FIELD_IDS)[number];

export const TwinTouchIds = ["WATCHED", "STARRED", "REVIEWED"] as const;

export const TwinBasicFields = [
  "assigneeUserId",
  "createdByUserId",
  "name",
  "description",
] as const;

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

export const DYNAMIC_FIELDS_MAP: Record<
  DynamicFieldType,
  (value: TwinFieldValue) => { type: string }
> = {
  textV1: (value: TwinFieldValue): TwinFieldSearchText => ({
    type: "TwinFieldSearchTextV1",
    valueLikeAllOfList: toArrayOfString(toArray(value)).map(wrapWithPercent),
  }),
  numericFieldV1: (value: TwinFieldValue): TwinFieldSearchNumeric => ({
    type: "TwinFieldSearchNumericV1",
    equals: toArrayOfString(toArray(value))[0],
  }),
  selectListV1: (value: TwinFieldValue): TwinFieldSearchList => ({
    type: "TwinFieldSearchListV1",
    optionsAllOfList: toArrayOfString(toArray(value)),
  }),
  dateScrollV1: (value: TwinFieldValue): TwinFieldSearchDate => ({
    type: "TwinFieldSearchDateV1",
    equals: `${toArrayOfString(toArray(value))[0]}T00:00:00`,
  }),
};
// === Twin fields ===
