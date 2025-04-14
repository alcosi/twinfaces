import { z } from "zod";

export const LOGIN_FORM_SCHEMA = z.object({
  domainId: z.string().uuid("Domain ID must be a valid UUID"),
  userId: z.string().uuid("Please enter a valid UUID"),
  businessAccountId: z
    .string()
    .uuid("Please enter a valid UUID")
    .optional()
    .or(z.literal("")),
});
