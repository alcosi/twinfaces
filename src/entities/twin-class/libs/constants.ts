import { z } from "zod";

import {
  FEATURER_ID_EXTRACTOR,
  FEATURER_PARAMS_VALUE,
} from "@/entities/featurer";
import {
  FIRST_ID_EXTRACTOR,
  REGEX_PATTERNS,
  isPopulatedArray,
} from "@/shared/libs";

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
      REGEX_PATTERNS.TWIN_CLASS_KEY,
      "Letters, numbers, underscores, and spaces allowed"
    ),
  name: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("").transform(() => undefined)),
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
    ),
  abstractClass: z.boolean().default(false),
  segment: z.boolean().default(false),
  assigneeRequired: z.boolean().default(false),
  headTwinClass: z.array(z.object({ id: z.string().uuid() })).nullable(),
  headHunterFeaturerId: z.number().or(FEATURER_ID_EXTRACTOR).optional(),
  headHunterParams: FEATURER_PARAMS_VALUE,
  extendsTwinClassId: z.string().uuid().nullable().or(FIRST_ID_EXTRACTOR),
  logo: z
    .string()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  permissionSchemaSpace: z.boolean().default(false),
  twinflowSchemaSpace: z.boolean().default(false),
  twinClassSchemaSpace: z.boolean().default(false),
  aliasSpace: z.boolean().default(false),
  markerDataListId: z.string().uuid().optional().or(FIRST_ID_EXTRACTOR),
  tagDataListId: z.string().uuid().optional().or(FIRST_ID_EXTRACTOR),
  viewPermissionId: z.string().uuid().optional().or(FIRST_ID_EXTRACTOR),
  createPermissionId: z.string().uuid().optional().or(FIRST_ID_EXTRACTOR),
  autoCreateTwinflow: z.boolean().default(false),
  autoCreatePermissions: z.boolean().default(true),
  space: z.boolean().default(false),
  uniqueName: z.boolean().default(false),
});

export const TWIN_CLASS_DYNAMIC_MARKER_SCHEMA = z.object({
  twinClassId: z.string().uuid("Twin class is required").or(FIRST_ID_EXTRACTOR),
  twinValidatorSetId: z
    .string()
    .uuid("Validator set is required")
    .or(FIRST_ID_EXTRACTOR),
  markerDataListOptionId: z
    .string()
    .uuid("Marker option is required")
    .or(FIRST_ID_EXTRACTOR),
});

export type TwinClassDynamicMarkerFieldValues = z.infer<
  typeof TWIN_CLASS_DYNAMIC_MARKER_SCHEMA
>;
