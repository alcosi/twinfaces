import { RelatedObjects } from "@/shared/api";

import { extendFeaturerParams } from "../../../features/featurer/utils/helpers";
import { TwinValidator, TwinValidator_DETAILED } from "../api";

export const hydrateTwinValidatorFromMap = (
  dto: TwinValidator,
  relatedObjects?: RelatedObjects
): TwinValidator_DETAILED => {
  const hydrated: TwinValidator_DETAILED = Object.assign(
    {},
    dto
  ) as TwinValidator_DETAILED;

  if (dto.twinValidatorSetId && relatedObjects?.twinValidatorSetMap) {
    hydrated.twinValidatorSet =
      relatedObjects.twinValidatorSetMap[dto.twinValidatorSetId]!;
  }

  if (dto.validatorFeaturerId && relatedObjects?.featurerMap) {
    hydrated.validatorFeaturer =
      relatedObjects.featurerMap[dto.validatorFeaturerId]!;
  }

  if (hydrated.validatorParams && hydrated.validatorFeaturer?.params) {
    hydrated.validatorDetailedParams = extendFeaturerParams(
      hydrated.validatorParams,
      hydrated.validatorFeaturer.params
    );
  }

  return hydrated;
};
