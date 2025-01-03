import { z } from "zod";
import { FeaturerParamType } from "./types";

export const ENTITY_COLOR = "#0EA5E9";

export const FEATURER_FIELD_SCHEMA = z.object({
  id: z.number().optional(),
  params: z
    .record(
      z.object({
        value: z.string(),
        type: z.enum(
          Object.values(FeaturerParamType) as [
            FeaturerParamType,
            ...FeaturerParamType[],
          ]
        ),
      })
    )
    .optional(),
});

export const UUID_SCHEMA = z.string().uuid("Please enter a valid UUID");
export const UUID_SET_SCHEMA = z.array(UUID_SCHEMA);
