import { z } from "zod";

import { DOMAIN_ID_SCHEMA } from "@/entities/domain";

export const STUB_AUTH_FORM_SCHEMA = z.object({
  domainId: DOMAIN_ID_SCHEMA,
  userId: z.string().uuid("Please enter a valid UUID"),
  businessAccountId: z
    .string()
    .uuid("Please enter a valid UUID")
    .optional()
    .or(z.literal("")),
});

export const LOGIN_AUTH_FORM_SCHEMA = z.object({
  domainId: DOMAIN_ID_SCHEMA,
  username: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const REGISTER_AUTH_PAYLOAD_SCHEMA = z.object({
  domainId: DOMAIN_ID_SCHEMA,
  firstName: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const REGISTER_AUTH_FORM_SCHEMA = REGISTER_AUTH_PAYLOAD_SCHEMA.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords must match",
});
