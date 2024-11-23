import { z } from "zod";

export const PERMISSION_SCHEMA = z.object({
  groupId: z.string().uuid("Group ID must be a valid UUID"),
  key: z.string().min(1, "Key must not be empty"),
  name: z.string().min(1, "Name must not be empty"),
  description: z.string().optional(),
});
