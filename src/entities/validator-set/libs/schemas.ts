import { z } from "zod";

export const VALIDATOR_SETS_SHEMA = z.object({
  name: z.string().max(100).optional(),
  description: z.string().optional(),
  invert: z.boolean(),
});
