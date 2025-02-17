import { RelatedObjects } from "@/shared/api";
import { TwinFlowSchema, TwinFlowSchema_DETAILED } from "../api";

export const hydrateTwinFlowSchemaFromMap = (
  dto: TwinFlowSchema,
  relatedObjects?: RelatedObjects
): TwinFlowSchema_DETAILED => {
  const hydrated: TwinFlowSchema_DETAILED = Object.assign(
    {},
    dto
  ) as TwinFlowSchema_DETAILED;

  // TODO: Add hydration logic here

  return hydrated;
};
