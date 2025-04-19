import { z } from "zod";

import { STATIC_TWIN_FIELD_KEYS, TWIN_SCHEMA } from "./constants";

export type TwinFormValues = z.infer<typeof TWIN_SCHEMA>;

// === Twin fields ===
export type StaticTwinFieldKey = (typeof STATIC_TWIN_FIELD_KEYS)[number];

export const STATIC_TWIN_FIELD_NAME_TO_ID_MAP: Record<
  StaticTwinFieldKey,
  string
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
};
