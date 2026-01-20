import z from "zod";

import {
  FEATURER_ID_EXTRACTOR,
  FEATURER_PARAMS_VALUE,
} from "@/entities/featurer";
import { FIRST_ID_EXTRACTOR } from "@/shared/libs";

export const PROJECTION_SCHEMA = z.object({
  srcTwinPointerId: z
    .string()
    .uuid("Src pointed twin ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  projectionTypeId: z
    .string()
    .uuid("Projection type ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  srcTwinClassFieldId: z
    .string()
    .uuid("Src twin class field ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  dstTwinClassId: z
    .string()
    .uuid("Dst twin class ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  dstTwinClassFieldId: z
    .string()
    .uuid("Dst twin class field ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  fieldProjectorFeaturerId: z.number().or(FEATURER_ID_EXTRACTOR),
  active: z.boolean(),
  fieldProjectorParams: FEATURER_PARAMS_VALUE,
});
