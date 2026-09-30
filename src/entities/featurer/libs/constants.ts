import { z } from "zod";

import { isPopulatedArray } from "@/shared/libs";

import { FeaturerParamType } from "./types";

export const FEATURER_ID_EXTRACTOR = z
  .array(z.object({ id: z.number() }))
  .min(1, "Required")
  .transform((arr) => (isPopulatedArray<{ id: number }>(arr) ? arr[0].id : 0));

// Mirrors FEATURER_ID_EXTRACTOR for featurers the API marks as optional: an
// untouched combobox yields `[]`, which has to collapse to `undefined` rather
// than fail a `.min(1)` check.
export const OPTIONAL_FEATURER_ID_EXTRACTOR = z
  .union([z.literal(""), z.array(z.object({ id: z.number() })), z.number()])
  .optional()
  .transform((value) => {
    if (isPopulatedArray<{ id: number }>(value)) return value[0].id;
    return typeof value === "number" ? value : undefined;
  });

export const FEATURER_PARAMS_VALUE = z
  .record(
    z.string(),
    z.union([
      z.string(),
      z.number().transform((v) => v.toString()),
      z.boolean().transform((v) => v.toString()),
    ])
  )
  .optional();

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
