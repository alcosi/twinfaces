import { z } from "zod";
import { FIRST_UUID_EXTRACTOR } from "@/shared/libs";

export const DATALIST_OPTION_STATUS_TYPES = [
  "active",
  "disabled",
  "hidden",
] as const;

export const DATALIST_OPTION_SCHEMA = z.object({
  dataListId: z.string().uuid().nullable().or(FIRST_UUID_EXTRACTOR),
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

export type FormFieldNames =
  | "attribute1"
  | "attribute2"
  | "attribute3"
  | "attribute4";
