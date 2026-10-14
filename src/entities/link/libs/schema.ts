import { z } from "zod";

import { FIRST_ID_EXTRACTOR, isPopulatedArray } from "@/shared/libs";

import { LINK_STRENGTH_SCHEMA, LINK_TYPES_SCHEMA } from "./constants";
import { LinkStrength, LinkType, LinkTypesEnum } from "./types";

export const LINK_SCHEMA = z.object({
  srcTwinClassId: z
    .string()
    .uuid("Source twin class ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  dstTwinClassId: z
    .string()
    .uuid("Destination twin class ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  name: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
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
    .union([
      z.literal(""),
      z.array(z.object({ id: LINK_STRENGTH_SCHEMA })),
      LINK_STRENGTH_SCHEMA,
    ])
    .optional()
    .transform<LinkStrength | undefined>((value) => {
      if (isPopulatedArray<{ id: LinkStrength }>(value)) return value[0].id;
      return typeof value === "string" && value !== "" ? value : undefined;
    }),
});
