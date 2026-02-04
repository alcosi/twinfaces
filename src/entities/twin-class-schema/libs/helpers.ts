import { RelatedObjects } from "@/shared/api";

import { TwinClassSchema, TwinClassSchema_DETAILED } from "../api";

export const hydrateTwinClassSchemaFromMap = (
  dto: TwinClassSchema,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  relatedObjects?: RelatedObjects
): TwinClassSchema_DETAILED => {
  const hydrated: TwinClassSchema_DETAILED = Object.assign(
    {},
    dto
  ) as TwinClassSchema_DETAILED;

  // TODO: Add hydration logic here if needed

  return hydrated;
};
