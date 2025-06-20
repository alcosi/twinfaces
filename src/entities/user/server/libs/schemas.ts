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

export const EMAIL_PASSWORD_SIGN_IN_SCHEMA = z.object({
  domainId: DOMAIN_ID_SCHEMA,
  username: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const EMAIL_PASSWORD_SIGN_UP_PAYLOAD_SCHEMA = z.object({
  domainId: DOMAIN_ID_SCHEMA,
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password must not be longer than 128 characters." })
    .refine((val) => !/\s/.test(val), {
      message: "Password must not contain spaces",
    }),
});

export const EMAIL_PASSWORD_SIGN_UP_FORM_SCHEMA =
  EMAIL_PASSWORD_SIGN_UP_PAYLOAD_SCHEMA.extend({
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  }).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export const EMAIL_VERIFICATION_FORM_SCHEMA = z.object({
  domainId: DOMAIN_ID_SCHEMA,
  verificationToken: z.string().uuid(),
});
