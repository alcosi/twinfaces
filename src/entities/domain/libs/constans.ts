import { z } from "zod";
import { REGEX_PATTERNS } from "@/shared/libs";

const DOMAIN_ICON_SCHEMA = z.any();
// z.instanceof(File);
// .optional()
// .or(z.literal("").transform(() => undefined));

export const DOMAIN_CREATE_SCHEMA = z.object({
  key: z
    .string()
    .min(3)
    .max(100)
    .regex(
      REGEX_PATTERNS.ALPHANUMERIC_WITH_DASHES,
      "Key can only contain latin letters, numbers, underscores and dashes"
    ),
  description: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  type: z.enum(["basic", "b2b"], {
    message: "Select account type",
  }),
  defaultLocale: z.enum(["en", "ru"], {
    message: "Select language",
  }),
  iconDark: DOMAIN_ICON_SCHEMA,
  iconLight: DOMAIN_ICON_SCHEMA,
});
