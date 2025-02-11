import { z } from "zod";
import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const PERMISSION_SCHEMA = z.object({
  groupId: z.string().uuid().optional().or(FIRST_ID_EXTRACTOR),
  key: z.string().min(1, "Key can not be empty"),
  name: z.string().min(1, "Name can not be empty"),
  description: z.string().optional(),
});
