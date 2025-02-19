import {
  FEATURER_ID_EXTRACTOR,
  FEATURER_PARAMS_VALUE,
} from "@/entities/featurer";
import {
  FIRST_ID_EXTRACTOR,
  isPopulatedArray,
  REGEX_PATTERNS,
} from "@/shared/libs";
import { z } from "zod";
import { TwinClass } from "../api";

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
  ownerType: z
    .array(
      z.object({
        id: z.enum(OWNER_TYPES),
      })
    )
    .min(1, "Required")
    .transform((arr) =>
      isPopulatedArray<{ id: TwinClass["ownerType"] }>(arr)
        ? arr[0].id
        : undefined
    )
    .optional(),
  abstractClass: z.boolean(),
  headTwinClass: z.array(z.object({ id: z.string().uuid() })).nullable(),
  headHunterFeaturerId: z.number().or(FEATURER_ID_EXTRACTOR).optional(),
  headHunterParams: FEATURER_PARAMS_VALUE,
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
  markerDataListId: z.string().uuid().optional().or(FIRST_ID_EXTRACTOR),
  tagDataListId: z.string().uuid().optional().or(FIRST_ID_EXTRACTOR),
  viewPermissionId: z.string().uuid().optional().or(FIRST_ID_EXTRACTOR),
  createPermissionId: z.string().uuid().optional().or(FIRST_ID_EXTRACTOR),
  editPermissionId: z.string().uuid().optional().or(FIRST_ID_EXTRACTOR),
  deletePermissionId: z.string().uuid().optional().or(FIRST_ID_EXTRACTOR),
  autoCreatePermissions: z.boolean(),
});
