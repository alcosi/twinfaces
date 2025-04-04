import { z } from "zod";

import { isPopulatedArray } from "./types";

export const NULLIFY_UUID_VALUE: string =
  "ffffffff-ffff-ffff-ffff-ffffffffffff";

export const REGEX_PATTERNS = {
  // UUID: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
  ALPHANUMERIC_WITH_DASHES: /^[a-zA-Z0-9_-]+$/,
  TWIN_CLASS_KEY: /^[a-zA-Z0-9_\s]+$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

export const FIRST_ID_EXTRACTOR = z
  .array(z.object({ id: z.string().uuid("Please enter a valid UUID") }))
  .min(1, "Required")
  .transform((arr) => (isPopulatedArray<{ id: string }>(arr) ? arr[0].id : ""));

export const FIRST_USER_ID_EXTRACTOR = z
  .array(z.object({ userId: z.string().uuid("Please enter a valid UUID") }))
  .min(1, "Required")
  .transform((arr) =>
    isPopulatedArray<{ userId: string }>(arr) ? arr[0].userId : ""
  );

export const FIRST_ALIAS_EXTRACTOR = z
  .array(z.object({ alias: z.string() }))
  .min(1, "Required")
  .transform((arr) =>
    isPopulatedArray<{ alias: string }>(arr) ? arr[0].alias : ""
  );

export const POSITION_MAP: Record<
  "top-left" | "top-right" | "bottom-right" | "bottom-left",
  string
> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
};
