import z from "zod";

export const RESOURCE_UPLOAD_SCHEMA = z.object({
  file: z
    .instanceof(File, { message: "Please select a file" })
    .refine((file) => file.size > 0, "File is empty"),
  title: z
    .string()
    .optional()
    .transform((value) => value || undefined),
  isPublic: z.boolean().default(true),
});
