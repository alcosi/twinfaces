import { z } from "zod";

export const ENTITY_COLOR = "#8B5CF6"; // text-violet-500

export const TWIN_FLOW_TRANSITION_SCHEMA = z.object({
  alias: z.string().min(1, "Alias can not be empty"),
  name: z.string().min(1, "Name can not be empty"),
  description: z.string().optional(),
  srcTwinStatusId: z
    .string()
    .uuid("Source Status ID must be a valid UUID")
    .optional(),
  dstTwinStatusId: z
    .string()
    .uuid("Destination Status ID must be a valid UUID"),
  permissionId: z
    .string()
    .uuid("Permission ID must be a valid UUID")
    .optional(),
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
