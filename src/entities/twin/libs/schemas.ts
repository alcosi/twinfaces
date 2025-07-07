import { z } from "zod";

import {
  FIRST_ID_EXTRACTOR,
  //FIRST_USER_ID_EXTRACTOR
} from "@/shared/libs";

import { transformToTwinTags } from "./helpers";

export const TWIN_SCHEMA = z.object({
  classId: FIRST_ID_EXTRACTOR,
  headTwinId: FIRST_ID_EXTRACTOR.optional(),
  name: z.string().min(1, "Name can not be empty"),
  // assignerUserId: FIRST_USER_ID_EXTRACTOR,
  assignerUserId: z.any().optional(),
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
