import { z } from "zod";

export const PERMISSION_SCHEMA = z.object({
  groupId: z.string().uuid("Group ID must be a valid UUID"),
  key: z.string().min(1, "Key can not be empty"),
  name: z.string().min(1, "Name can not be empty"),
  description: z.string().optional(),
});
