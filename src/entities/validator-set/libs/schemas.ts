import { z } from "zod";

export const VALIDATOR_SETS_SHEMA = z.object({
  name: z
    .string()
    .max(100)
    .optional()
    .transform((value) => value || undefined),
  description: z
    .string()
    .optional()
    .transform((value) => value || undefined),
  invert: z.boolean(),
});
