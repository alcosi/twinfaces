import { z } from "zod";

import { FIRST_ID_EXTRACTOR, FIRST_USER_ID_EXTRACTOR } from "@/shared/libs";

import { transformToTwinTags } from "./helpers";

export const TWIN_SCHEMA = z.object({
  classId: FIRST_ID_EXTRACTOR,
  headTwinId: z.union([FIRST_ID_EXTRACTOR, z.string().uuid()]).optional(),
  name: z.string().optional(),
  isSketch: z.boolean().optional(),
  assignerUserId: FIRST_USER_ID_EXTRACTOR.optional(),
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
