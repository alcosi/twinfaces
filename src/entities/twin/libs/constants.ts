import {
  invertMap,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { TwinFilterKeys } from "../server";
import {
  SearchableTwinFieldType,
  TwinFieldFilterInput,
  TwinFieldSearchDate,
  TwinFieldSearchList,
  TwinFieldSearchNumeric,
  TwinFieldSearchText,
  TwinSelfFieldId,
  TwinSelfFieldKey,
} from "./types";

export const TwinTouchIds = ["WATCHED", "STARRED", "REVIEWED"] as const;

export const TwinBasicFields = [
  "assigneeUserId",
  "createdByUserId",
  "name",
  "description",
] as const;

// === Twin fields ===
export const TWIN_SELF_FIELD_KEYS = [
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
export const TWIN_SELF_FIELD_IDS = [
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

export const TWIN_SELF_FIELD_ID_TO_KEY_MAP: Record<
  TwinSelfFieldId,
  TwinSelfFieldKey
> = {
  "00000000-0000-0000-0011-000000000003": "name",
  "00000000-0000-0000-0011-000000000004": "description",
  "00000000-0000-0000-0011-000000000005": "externalId",
  "00000000-0000-0000-0011-000000000006": "ownerUserId",
  "00000000-0000-0000-0011-000000000007": "assignerUserId",
  "00000000-0000-0000-0011-000000000008": "authorUserId",
  "00000000-0000-0000-0011-000000000009": "headTwinId",
  "00000000-0000-0000-0011-000000000010": "statusId",
  "00000000-0000-0000-0011-000000000011": "createdAt",
  "00000000-0000-0000-0011-000000000012": "id",
  "00000000-0000-0000-0011-000000000013": "twinClassId",
  "00000000-0000-0000-0011-000000000014": "aliases",
  "00000000-0000-0000-0011-000000000015": "tags",
  "00000000-0000-0000-0011-000000000016": "markers",
};
export const TWIN_SELF_FIELD_KEY_TO_ID_MAP: Record<
  TwinSelfFieldKey,
  TwinSelfFieldId
> = invertMap(TWIN_SELF_FIELD_ID_TO_KEY_MAP);

export const STATIC_TWIN_FIELD_ID_TO_FILTERS_KEY_MAP: Partial<
  Record<TwinSelfFieldId, TwinFilterKeys>
> = {
  "00000000-0000-0000-0011-000000000012": "twinIdList",
  "00000000-0000-0000-0011-000000000013": "twinClassIdList",
  "00000000-0000-0000-0011-000000000010": "statusIdList",
  "00000000-0000-0000-0011-000000000003": "twinNameLikeList",
  "00000000-0000-0000-0011-000000000004": "descriptionLikeList",
  "00000000-0000-0000-0011-000000000009": "headTwinIdList",
  "00000000-0000-0000-0011-000000000008": "createdByUserIdList",
  "00000000-0000-0000-0011-000000000007": "assignerUserIdList",
  "00000000-0000-0000-0011-000000000011": "createdAt",
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

export const TWIN_CLASS_FIELD_TYPE_TO_SEARCH_PAYLOAD: Record<
  SearchableTwinFieldType,
  (value: TwinFieldFilterInput) => { type: string }
> = {
  textV1: (value: TwinFieldFilterInput): TwinFieldSearchText => ({
    type: "TwinFieldSearchTextV1",
    valueLikeAllOfList: toArrayOfString(toArray(value)).map(wrapWithPercent),
  }),
  numericFieldV1: (value: TwinFieldFilterInput): TwinFieldSearchNumeric => ({
    type: "TwinFieldSearchNumericV1",
    equals: toArrayOfString(toArray(value))[0],
  }),
  selectListV1: (value: TwinFieldFilterInput): TwinFieldSearchList => ({
    type: "TwinFieldSearchListV1",
    optionsAllOfList: toArrayOfString(toArray(value)),
  }),
  dateScrollV1: (value: TwinFieldFilterInput): TwinFieldSearchDate => ({
    type: "TwinFieldSearchDateV1",
    equals: `${toArrayOfString(toArray(value))[0]}T00:00:00`,
  }),
};
// === Twin fields ===
