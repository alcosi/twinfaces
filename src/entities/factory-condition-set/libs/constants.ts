import { z } from "zod";

export const CONDITION_SET_SCHEMA = z.object({
  name: z.string().min(1).max(100),
  description: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});
