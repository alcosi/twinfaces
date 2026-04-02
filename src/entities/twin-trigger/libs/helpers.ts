import { Featurer_DETAILED } from "@/entities/featurer";
import { RelatedObjects } from "@/shared/api";

import { extendFeaturerParams } from "../../../features/featurer/utils/helpers";
import { TwinTrigger, TwinTrigger_DETAILED } from "../api/types";

export const hydrateTwinTriggerFromMap = (
  dto: TwinTrigger,
  relatedObjects?: RelatedObjects
): TwinTrigger_DETAILED => {
  const hydrated: TwinTrigger_DETAILED = Object.assign(
    {},
    dto
  ) as TwinTrigger_DETAILED;

  if (dto.triggerFeaturerId && relatedObjects?.featurerMap) {
    hydrated.triggerFeaturer = relatedObjects.featurerMap[
      dto.triggerFeaturerId
    ] as Featurer_DETAILED;
  }

  if (hydrated.triggerParams && hydrated.triggerFeaturer?.params) {
    hydrated.triggerDetailedParams = extendFeaturerParams(
      hydrated.triggerParams,
      hydrated.triggerFeaturer.params
    );
  }

  return hydrated;
};
