import { z } from "zod";

export const RECIPIENT_SCHEMA = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type RecipientFieldValues = z.infer<typeof RECIPIENT_SCHEMA>;
