import { z } from "zod";

import {
  FIRST_ID_EXTRACTOR,
  OPTIONAL_FIRST_ID_EXTRACTOR,
  OPTIONAL_FIRST_USER_ID_EXTRACTOR,
} from "@/shared/libs";

import { transformToTwinTags } from "./helpers";

export const TWIN_SCHEMA = z.object({
  // TwinCreateRqV2 marks classId optional, but no twin can be created without one.
  classId: z.string().uuid("Twin class is required").or(FIRST_ID_EXTRACTOR),
  headTwinId: OPTIONAL_FIRST_ID_EXTRACTOR,
  name: z.string().optional(),
  isSketch: z.boolean().optional(),
  assignerUserId: OPTIONAL_FIRST_USER_ID_EXTRACTOR,
  externalId: z.string().optional(),
  description: z.string().optional(),
  fields: z.record(z.string(), z.string().default("")).optional(),
  tags: z
    .array(
      z.union([
        z.object({ id: z.string().uuid(), name: z.string() }),
        z.string(),
      ])
    )
    .transform(transformToTwinTags)
    .optional(),
});
