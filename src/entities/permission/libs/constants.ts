import { z } from "zod";

import { TWIN_ROLE_SCHEMA } from "@/entities/twin-role";
import { FIRST_ID_EXTRACTOR, FIRST_USER_ID_EXTRACTOR } from "@/shared/libs";

export const PERMISSION_SCHEMA = z.object({
  groupId: z
    .string()
    .uuid("Group ID must be a valid UUID")
    .optional()
    .or(FIRST_ID_EXTRACTOR),
  key: z.string().min(1, "Key can not be empty"),
  name: z.string().min(1, "Name can not be empty"),
  description: z.string().optional(),
});

export const PERMISSION_GRANT_TWIN_ROLE_SCHEMA = z.object({
  permissionId: z
    .string()
    .uuid("Permission ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  permissionSchemaId: z
    .string()
    .uuid("Permission schema ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  twinClassId: z
    .string()
    .uuid("Twin class ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  twinRole: z.union([
    TWIN_ROLE_SCHEMA,
    z
      .array(TWIN_ROLE_SCHEMA)
      .min(1, "Required")
      .transform((arr) => arr[0]),
  ]),
});

export const PERMISSION_GRANT_USER_SCHEMA = z.object({
  permissionId: z
    .string()
    .uuid("Permission ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  permissionSchemaId: z
    .string()
    .uuid("Permission schema ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  userId: z
    .string()
    .uuid("User ID must be a valid UUID")
    .or(FIRST_USER_ID_EXTRACTOR),
});

export const PERMISSION_GRANT_USER_GROUP_SCHEMA = z.object({
  permissionSchemaId: z
    .string()
    .uuid("Permission schema ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  permissionId: z
    .string()
    .uuid("Permission ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  userGroupId: z
    .string()
    .uuid("User group ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
});
