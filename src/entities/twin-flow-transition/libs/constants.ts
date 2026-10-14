import { z } from "zod";

import {
  FEATURER_ID_EXTRACTOR,
  FEATURER_PARAMS_VALUE,
} from "@/entities/featurer";
import {
  FIRST_ID_EXTRACTOR,
  OPTIONAL_FIRST_ID_EXTRACTOR,
  isPopulatedArray,
  isPopulatedString,
} from "@/shared/libs";

import { TransitionType, TransitionTypesEnum } from "./types";

export const TRANSITION_TYPES_ENUM: Array<{
  id: TransitionType;
  label: string;
}> = [
  { id: TransitionTypesEnum.MARKETING, label: "Marketing" },
  { id: TransitionTypesEnum.OPERATION, label: "Operation" },
  { id: TransitionTypesEnum.OPERATION_DISABLE, label: "Operation disable" },
  { id: TransitionTypesEnum.STATUS_CHANGE, label: "Status change" },
  {
    id: TransitionTypesEnum.STATUS_CHANGE_MARKETING,
    label: "Status change marketing",
  },
] as const;

const TRANSITION_TYPE_ID = z.enum(
  [
    TransitionTypesEnum.MARKETING,
    TransitionTypesEnum.OPERATION,
    TransitionTypesEnum.OPERATION_DISABLE,
    TransitionTypesEnum.STATUS_CHANGE,
    TransitionTypesEnum.STATUS_CHANGE_MARKETING,
  ],
  { message: "Invalid type" }
);

// Field optionality mirrors TransitionCreateV1: only twinflowId, nameI18n and
// dstStatusId are required.
export const TWIN_FLOW_TRANSITION_SCHEMA = z.object({
  twinflow: z
    .array(
      z.object({
        id: z.string().uuid(),
        twinClassId: z.string().uuid(),
      })
    )
    .min(1, "Twinflow is required"),
  alias: z
    .union([
      z.literal(""),
      z.array(z.union([z.object({ alias: z.string() }), z.string()])),
    ])
    .optional()
    .transform((value) => {
      const first = isPopulatedArray<{ alias: string } | string>(value)
        ? value[0]
        : undefined;
      const alias = typeof first === "string" ? first : first?.alias;
      return isPopulatedString(alias) ? alias : undefined;
    }),
  name: z.string().min(1, "Name can not be empty"),
  description: z.string().optional(),
  factory: OPTIONAL_FIRST_ID_EXTRACTOR,
  srcTwinStatusId: OPTIONAL_FIRST_ID_EXTRACTOR,
  dstTwinStatusId: z
    .string()
    .uuid("Destination status is required")
    .or(FIRST_ID_EXTRACTOR),
  permissionId: OPTIONAL_FIRST_ID_EXTRACTOR,
  twinflowTransitionTypeId: z
    .union([
      z.literal(""),
      TRANSITION_TYPE_ID,
      z.array(z.object({ id: TRANSITION_TYPE_ID })),
    ])
    .optional()
    .transform((value) => {
      if (Array.isArray(value)) return value[0]?.id;
      return value || undefined;
    }),
});

export const TRIGGER_SCHEMA = z.object({
  order: z.coerce.number().min(0, "Order must be at least 0").default(0),
  active: z.boolean().default(false),
  triggerFeaturerId: z.number().or(FEATURER_ID_EXTRACTOR),
  triggerParams: FEATURER_PARAMS_VALUE,
});
