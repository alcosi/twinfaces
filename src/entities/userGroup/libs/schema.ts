import { z } from "zod";

import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

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
