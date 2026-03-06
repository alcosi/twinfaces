import { z } from "zod";

export const VALIDATOR_SETS_SHEMA = z.object({
  name: z.string().min(1, "Name can not be empty").max(100),
  description: z.string().optional(),
  invert: z.boolean(),
});
