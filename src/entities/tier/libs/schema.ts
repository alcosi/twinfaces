import z from "zod";

import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const TIER_SCHEMA = z.object({
  name: z.string().min(1, "Name can not be empty"),
  description: z.string().optional(),
  custom: z.boolean().default(false),
  permissionSchemaId: z
    .string()
    .uuid("Permission schema ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR)
    .optional(),
  twinflowSchemaId: z
    .string()
    .uuid("Twinflow schema ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR)
    .optional(),
  twinClassSchemaId: z
    .string()
    .uuid("Twin class schema ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR)
    .optional(),
  attachmentsStorageQuotaSize: z.coerce.number(),
  attachmentsStorageQuotaCount: z.coerce.number(),
  userCountQuota: z.coerce.number(),
});
