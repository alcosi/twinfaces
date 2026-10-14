import { z } from "zod";

import {
  FEATURER_PARAMS_VALUE,
  OPTIONAL_FEATURER_ID_EXTRACTOR,
} from "@/entities/featurer";
import {
  FIRST_ID_EXTRACTOR,
  OPTIONAL_FIRST_ID_EXTRACTOR,
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
  // Required by the API (TwinClassCreateV1.required).
  name: z.string().min(1, "Name can not be empty").max(100),
  description: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  // Optional per the API (TwinClassCreateV1 only requires key + nameI18n).
  // The combobox starts out `undefined` (or `""`), so both must pass as "not picked".
  ownerType: z
    .union([z.literal(""), z.array(z.object({ id: z.enum(OWNER_TYPES) }))])
    .optional()
    .transform((arr) =>
      isPopulatedArray<{ id: TwinClass["ownerType"] }>(arr)
        ? arr[0].id
        : undefined
    ),
  abstractClass: z.boolean().default(false),
  segment: z.boolean().default(false),
  assigneeRequired: z.boolean().default(false),
  headTwinClass: z.array(z.object({ id: z.string().uuid() })).nullable(),
  headHunterFeaturerId: OPTIONAL_FEATURER_ID_EXTRACTOR,
  headHunterParams: FEATURER_PARAMS_VALUE,
  // Both create forms default it to `null`.
  extendsTwinClassId: OPTIONAL_FIRST_ID_EXTRACTOR.nullable(),
  logo: z
    .string()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  permissionSchemaSpace: z.boolean().default(false),
  twinflowSchemaSpace: z.boolean().default(false),
  twinClassSchemaSpace: z.boolean().default(false),
  aliasSpace: z.boolean().default(false),
  markerDataListId: OPTIONAL_FIRST_ID_EXTRACTOR,
  tagDataListId: OPTIONAL_FIRST_ID_EXTRACTOR,
  viewPermissionId: OPTIONAL_FIRST_ID_EXTRACTOR,
  createPermissionId: OPTIONAL_FIRST_ID_EXTRACTOR,
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
