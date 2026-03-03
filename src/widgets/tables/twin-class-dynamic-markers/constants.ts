import { z } from "zod";

import { FIRST_ID_EXTRACTOR } from "@/shared/libs/index";

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
