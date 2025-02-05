import { z } from "zod";

export const DATALIST_OPTION_STATUS_TYPES = [
  "active",
  "disabled",
  "hidden",
] as const;

export const DATALIST_OPTION_SCHEMA = z.object({
  // TODO: replace any with something like `z.object(DataList).or(FIRST_UUID_EXTRACTOR)
  dataListId: z.any(),
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
