// NOTE: importing from '@/entities/datalist' triggers an excaption
import { z } from "zod";

import { DATALIST_SCHEMA } from "@/entities/datalist/libs/constans";

export const DATALIST_OPTION_STATUS_TYPES = [
  "active",
  "disabled",
  "hidden",
] as const;

const DATALIST_SCHEMA_EXTENDED = DATALIST_SCHEMA.extend({
  id: z.string(),
  attribute1: z.object({ key: z.string(), name: z.string() }).optional(),
  attribute2: z.object({ key: z.string(), name: z.string() }).optional(),
  attribute3: z.object({ key: z.string(), name: z.string() }).optional(),
  attribute4: z.object({ key: z.string(), name: z.string() }).optional(),
});

export const DATALIST_OPTION_SCHEMA = z.object({
  dataList: z.array(DATALIST_SCHEMA_EXTENDED),
  name: z.string().min(1).max(100),
  icon: z
    .string()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  attribute1: z.string().optional(),
  attribute2: z.string().optional(),
  attribute3: z.string().optional(),
  attribute4: z.string().optional(),
});
