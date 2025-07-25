import { z } from "zod";

import type { components } from "@/shared/api/generated/schema";

import type { TWIN_SELF_FIELD_IDS, TWIN_SELF_FIELD_KEYS } from "./constants";
import { TWIN_SCHEMA } from "./schemas";

export type TwinFormValues = z.infer<typeof TWIN_SCHEMA>;

// === Twin fields ===
export type SearchableTwinFieldType =
  | "textV1"
  | "numericFieldV1"
  | "selectListV1"
  | "dateScrollV1";

export type TwinFieldSearchText =
  components["schemas"]["TwinFieldSearchTextV1"];
export type TwinFieldSearchNumeric =
  components["schemas"]["TwinFieldSearchNumericV1"];
export type TwinFieldSearchList =
  components["schemas"]["TwinFieldSearchListV1"];
export type TwinFieldSearchDate =
  components["schemas"]["TwinFieldSearchDateV1"];

export type TwinFieldFilterInput = string | string[];

export type TwinSelfFieldKey = (typeof TWIN_SELF_FIELD_KEYS)[number];
export type TwinSelfFieldId = (typeof TWIN_SELF_FIELD_IDS)[number];
// === Twin fields ===
