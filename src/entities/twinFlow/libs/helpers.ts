import { RelatedObjects } from "@/shared/api";
import { TwinFlow_DETAILED } from "../api";

export const hydrateTwinFlowFromMap = (
  twinFlowDTO: unknown,
  relatedObjects?: RelatedObjects
): TwinFlow_DETAILED => {
  const TwinFlow: TwinFlow_DETAILED = Object.assign(
    {},
    twinFlowDTO
  ) as TwinFlow_DETAILED;

  // TODO: Add hydration logic here

  return TwinFlow;
};
