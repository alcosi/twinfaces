import { z } from "zod";

import { isPopulatedArray } from "../types";

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
