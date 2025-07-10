import { ZodType, z } from "zod";

import { TwinFieldType, TwinFieldUI } from "@/entities/twinField";
import { REGEX_PATTERNS } from "@/shared/libs/constants";

export function resolveTwinFieldSchema(
  twinField: TwinFieldUI
): ZodType<string> | undefined {
  switch (twinField.descriptor.fieldType) {
    case TwinFieldType.urlV1:
      return z
        .string()
        .regex(REGEX_PATTERNS.URL_REGEX, { message: "Invalid URL format" });
    case TwinFieldType.secretV1:
      return z.string().regex(/^\S*$/, {
        message: "Value must not contain spaces",
      });
    default:
      return undefined;
  }
}
