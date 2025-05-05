import { z } from "zod";

import type { components } from "@/shared/api/generated/schema";

import { TWIN_SCHEMA } from "./schemas";

export type TwinFormValues = z.infer<typeof TWIN_SCHEMA>;

// === Twin fields ===
export type TwinFieldSearchText =
  components["schemas"]["TwinFieldSearchTextV1"];
export type TwinFieldSearchNumeric =
  components["schemas"]["TwinFieldSearchNumericV1"];
export type TwinFieldSearchList =
  components["schemas"]["TwinFieldSearchListV1"];
export type TwinFieldSearchDate =
  components["schemas"]["TwinFieldSearchDateV1"];

export type TwinFieldValue = string | string[];

export type DynamicFieldType =
  | "textV1"
  | "numericFieldV1"
  | "selectListV1"
  | "dateScrollV1";
