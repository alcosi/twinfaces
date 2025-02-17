import {
  FIRST_ID_EXTRACTOR,
  FIRST_USER_ID_EXTRACTOR,
  isPopulatedString,
  isTruthy,
} from "@/shared/libs";
import { z } from "zod";

export const TwinTouchIds = ["WATCHED", "STARRED", "REVIEWED"] as const;

export const TwinBasicFields = [
  "assigneeUserId",
  "createdByUserId",
  "name",
  "description",
] as const;

export const TWIN_SCHEMA = z.object({
  classId: FIRST_ID_EXTRACTOR,
  headTwinId: FIRST_ID_EXTRACTOR.optional(),
  name: z.string().min(1, "Name can not be empty"),
  assignerUserId: FIRST_USER_ID_EXTRACTOR,
  description: z.string().optional(),
  fields: z.record(z.string(), z.string().default("")).optional(),
  tags: z
    .array(
      z.union([
        z.object({ id: z.string().uuid(), name: z.string() }),
        z.string(),
      ])
    )
    .transform(transformTags)
    .optional(),
});

function transformTags(arr: Array<{ id?: string; name: string } | string>) {
  return arr.reduce<{
    existingTags: string[];
    newTags: string[];
  }>(
    (acc, tag) => {
      if (isPopulatedString(tag)) {
        acc.newTags.push(tag);
      } else if (isTruthy(tag.id)) {
        acc.existingTags.push(tag.id);
      }

      return acc;
    },
    { existingTags: [], newTags: [] }
  );
}
