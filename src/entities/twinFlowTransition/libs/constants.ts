import { z } from "zod";

export const TWIN_FLOW_TRANSITION_SCHEMA = z.object({
  alias: z.string().min(1, "Alias must not be empty"),
  name: z.string().min(1, "Name must not be empty"),
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
