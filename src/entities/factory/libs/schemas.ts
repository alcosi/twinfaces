import { z } from "zod";

export const FACTORY_SCHEMA = z.object({
  key: z.string().min(1, "Key can not be empty"),
  name: z.string().min(1, "Name can not be empty"),
  description: z.string().optional().default(""),
});
