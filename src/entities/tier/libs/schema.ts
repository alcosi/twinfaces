import z from "zod";

import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

// Quotas are optional in TierCreateV1. A cleared number input holds "", which
// `z.coerce.number()` alone would turn into 0 (and `undefined` into NaN).
const OPTIONAL_QUOTA = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number({ invalid_type_error: "Must be a number" }).optional()
);

export const TIER_SCHEMA = z.object({
  name: z
    .string()
    .optional()
    .transform((value) => value || undefined),
  description: z
    .string()
    .optional()
    .transform((value) => value || undefined),
  custom: z.boolean().default(false),
  permissionSchemaId: z
    .string()
    .uuid("Permission schema ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  twinflowSchemaId: z
    .string()
    .uuid("Twinflow schema ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  twinClassSchemaId: z
    .string()
    .uuid("Twin class schema ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  attachmentsStorageQuotaSize: OPTIONAL_QUOTA,
  attachmentsStorageQuotaCount: OPTIONAL_QUOTA,
  userCountQuota: OPTIONAL_QUOTA,
});
