import { z } from "zod";

import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const OPTION_PROJECTION_SHEMA = z.object({
  projectionTypeId: z
    .string()
    .uuid("Projection Type ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  srcDataListOptionId: z
    .string()
    .uuid("Src Data List Option ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  dstDataListOptionId: z
    .string()
    .uuid("Dst Data List Option ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
});
