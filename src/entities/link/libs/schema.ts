import { z } from "zod";

import { FIRST_ID_EXTRACTOR, isPopulatedArray } from "@/shared/libs";

import { LINK_STRENGTH_SCHEMA, LINK_TYPES_SCHEMA } from "./constants";
import {
  LinkStrength,
  LinkStrengthEnum,
  LinkType,
  LinkTypesEnum,
} from "./types";

export const LINK_SCHEMA = z.object({
  srcTwinClassId: z.string().uuid().or(FIRST_ID_EXTRACTOR),
  dstTwinClassId: z.string().uuid().or(FIRST_ID_EXTRACTOR),
  name: z.string().min(1, "Name can not be empty"),
  type: z
    .array(z.object({ id: LINK_TYPES_SCHEMA }))
    .min(1, "Required")
    .transform<LinkType>((arr) =>
      isPopulatedArray<{ id: string }>(arr)
        ? (arr[0].id as LinkType)
        : LinkTypesEnum.OneToOne
    )
    .or(LINK_TYPES_SCHEMA),
  linkStrength: z
    .array(z.object({ id: LINK_STRENGTH_SCHEMA }))
    .min(1, "Required")
    .transform<LinkStrength>((arr) =>
      isPopulatedArray<{ id: string }>(arr)
        ? (arr[0].id as LinkStrength)
        : LinkStrengthEnum.MANDATORY
    )
    .or(LINK_STRENGTH_SCHEMA),
});
