import { z } from "zod";

import { FIRST_ALIAS_EXTRACTOR, FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const TWIN_FLOW_TRANSITION_SCHEMA = z.object({
  twinflow: z
    .string()
    .uuid("Twinflow ID must be a valid UUID ")
    .or(FIRST_ID_EXTRACTOR),
  alias: FIRST_ALIAS_EXTRACTOR,
  name: z.string().min(1, "Name can not be empty"),
  description: z.string().optional(),
  factory: z.string().uuid().optional().or(FIRST_ID_EXTRACTOR),
  srcTwinStatusId: z
    .string()
    .uuid("Source Status ID must be a valid UUID")
    .optional()
    .or(FIRST_ID_EXTRACTOR),
  dstTwinStatusId: z
    .string()
    .uuid("Destination Status ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  permissionId: z
    .string()
    .uuid("Permission ID must be a valid UUID")
    .optional()
    .or(FIRST_ID_EXTRACTOR),
});

export const TRIGGER_SCHEMA = z.object({
  order: z.number().min(0, "Order must be at least 0").default(0),
  active: z.boolean().default(false),
  triggerFeaturerId: z
    .number()
    .or(z.literal("").transform(() => undefined))
    .optional(),
  triggerParams: z.record(z.string(), z.any()).optional(),
});

export const VALIDATOR_RULES_SCHEMA = z.object({
  order: z.number().min(0, "Order must be at least 0").default(0),
  active: z.boolean().default(false),
});
