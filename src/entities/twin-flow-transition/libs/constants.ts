import { z } from "zod";

import { FEATURER_ID_EXTRACTOR } from "@/entities/featurer";
import {
  FIRST_ID_EXTRACTOR,
  isPopulatedArray,
  isPopulatedString,
} from "@/shared/libs";

import { TransitionType, TransitionTypesEnum } from "./types";

const TRANSITION_TYPE_EXTRACTOR = z
  .array(z.object({ id: z.string() }))
  .min(1)
  .transform((arr) => arr[0]?.id as TransitionType);

export const TRANSITION_TYPES_ENUM: Array<{
  id: TransitionType;
  label: string;
}> = [
  { id: TransitionTypesEnum.MARKETING, label: "Marketing" },
  { id: TransitionTypesEnum.OPERATION, label: "Operation" },
  { id: TransitionTypesEnum.STATUS_CHANGE, label: "Status change" },
  {
    id: TransitionTypesEnum.STATUS_CHANGE_MARKETING,
    label: "Status change marketing",
  },
] as const;

export const TWIN_FLOW_TRANSITION_SCHEMA = z.object({
  twinflow: z
    .array(
      z.object({
        id: z.string().uuid(),
        twinClassId: z.string().uuid(),
      })
    )
    .min(1, "Please enter a valid UUID"),
  alias: z
    .array(z.union([z.object({ alias: z.string() }), z.string()]))
    .min(1, "Required")
    .transform((arr) => {
      if (isPopulatedArray(arr) && isPopulatedString(arr[0])) {
        return arr[0];
      }

      return isPopulatedArray<{ alias: string }>(arr) ? arr[0].alias : "";
    }),
  name: z.string().min(1, "Name can not be empty"),
  description: z.string().optional(),
  factory: z.string().uuid().optional().or(FIRST_ID_EXTRACTOR),
  srcTwinStatusId: z
    .string()
    .uuid("Source Status ID must be a valid UUID")
    .optional()
    .or(FIRST_ID_EXTRACTOR),
  dstTwinStatusId: z
    .string()
    .uuid("Destination Status ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  permissionId: z
    .string()
    .uuid("Permission ID must be a valid UUID")
    .optional()
    .or(FIRST_ID_EXTRACTOR),
  twinflowTransitionTypeId: z
    .enum(
      [
        TransitionTypesEnum.MARKETING,
        TransitionTypesEnum.OPERATION,
        TransitionTypesEnum.STATUS_CHANGE,
        TransitionTypesEnum.STATUS_CHANGE_MARKETING,
      ],
      { message: "Invalid type" }
    )
    .optional()
    .or(TRANSITION_TYPE_EXTRACTOR),
});

export const TRIGGER_SCHEMA = z.object({
  order: z.coerce.number().min(0, "Order must be at least 0").default(0),
  active: z.boolean().default(false),
  triggerFeaturerId: z.number().or(FEATURER_ID_EXTRACTOR),
  triggerParams: z.record(z.string(), z.any()).optional(),
});

export const VALIDATOR_RULES_SCHEMA = z.object({
  order: z.number().min(0, "Order must be at least 0").default(0),
  active: z.boolean().default(false),
});
