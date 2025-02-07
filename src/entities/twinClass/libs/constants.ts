import { FEATURER_FIELD_SCHEMA } from "@/entities/featurer";
import { FIRST_ID_EXTRACTOR, REGEX_PATTERNS } from "@/shared/libs";
import { z } from "zod";

export const OWNER_TYPES = [
  "SYSTEM",
  "USER",
  "BUSINESS_ACCOUNT",
  "DOMAIN",
  "DOMAIN_BUSINESS_ACCOUNT",
  "DOMAIN_USER",
  "DOMAIN_BUSINESS_ACCOUNT_USER",
] as const;

export const TWIN_CLASSES_SCHEMA = z.object({
  key: z
    .string()
    .min(1)
    .max(100)
    .regex(
      REGEX_PATTERNS.ALPHANUMERIC_WITH_DASHES,
      "Key can only contain latin letters, numbers, underscores and dashes"
    ),
  name: z.string().min(1).max(100),
  description: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  abstractClass: z.boolean(),
  headTwinClass: z.array(z.object({ id: z.string().uuid() })).nullable(),
  headHunterFeaturer: FEATURER_FIELD_SCHEMA,
  extendsTwinClassId: z.string().uuid().nullable().or(FIRST_ID_EXTRACTOR),
  logo: z
    .string()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  permissionSchemaSpace: z.boolean(),
  twinflowSchemaSpace: z.boolean(),
  twinClassSchemaSpace: z.boolean(),
  aliasSpace: z.boolean(),
  markerDataListId: z
    .array(z.object({ id: z.string() }))
    .optional()
    .transform((arr) => arr?.[0]?.id ?? undefined)
    .or(z.string()),
  tagDataListId: z
    .array(z.object({ id: z.string() }))
    .optional()
    .transform((arr) => arr?.[0]?.id ?? undefined)
    .or(z.string()),
  viewPermissionId: z
    .array(z.object({ id: z.string() }))
    .optional()
    .transform((arr) => arr?.[0]?.id ?? undefined)
    .or(z.string()),
  createPermissionId: z
    .array(z.object({ id: z.string() }))
    .optional()
    .transform((arr) => arr?.[0]?.id ?? undefined)
    .or(z.string()),
  editPermissionId: z
    .array(z.object({ id: z.string() }))
    .optional()
    .transform((arr) => arr?.[0]?.id ?? undefined)
    .or(z.string()),
  deletePermissionId: z
    .array(z.object({ id: z.string() }))
    .optional()
    .transform((arr) => arr?.[0]?.id ?? undefined)
    .or(z.string()),
  autoCreatePermissions: z.boolean(),
});
