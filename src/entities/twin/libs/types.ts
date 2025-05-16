import { z } from "zod";

import type {
  STATIC_TWIN_FIELD_IDS,
  STATIC_TWIN_FIELD_KEYS,
  TWIN_SCHEMA,
} from "./constants";

export type TwinFormValues = z.infer<typeof TWIN_SCHEMA>;

// === Twin fields ===
export type StaticTwinFieldKey = (typeof STATIC_TWIN_FIELD_KEYS)[number];
export type StaticTwinFieldId = (typeof STATIC_TWIN_FIELD_IDS)[number];
