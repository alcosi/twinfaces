import { RelatedObjects } from "@/shared/api";
import { Featurer, Featurer_DETAILED } from "../api";

export const hydrateFeaturerFromMap = (
  dto: Featurer,
  relatedObjects?: RelatedObjects
): Featurer_DETAILED => {
  const hydrated: Featurer_DETAILED = Object.assign(
    {},
    dto
  ) as Featurer_DETAILED;

  // TODO: Add hydration logic here

  return hydrated;
};
