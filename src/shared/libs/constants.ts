import { z } from "zod";

import { isPopulatedArray } from "./types";

export const NULLIFY_UUID_VALUE: string =
  "ffffffff-ffff-ffff-ffff-ffffffffffff";

export const REGEX_PATTERNS = {
  // UUID: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
  ALPHANUMERIC_WITH_DASHES: /^[a-zA-Z0-9_-]+$/,
  TWIN_CLASS_KEY: /^[a-zA-Z0-9_\s]+$/,
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
