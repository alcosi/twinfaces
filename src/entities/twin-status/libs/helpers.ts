import { TwinClass_DETAILED } from "@/entities/twin-class";
import { RelatedObjects } from "@/shared/api";

import { TwinStatus, TwinStatusCreateRq, TwinStatus_DETAILED } from "../api";
import { TwinClassStatusFormValues } from "./types";

export const hydrateTwinStatusFromMap = (
  dto: TwinStatus,
  relatedObjects?: RelatedObjects
): TwinStatus_DETAILED => {
  const hydrated: TwinStatus_DETAILED = Object.assign(
    {},
    dto
  ) as TwinStatus_DETAILED;

  if (dto.twinClassId && relatedObjects?.twinClassMap) {
    hydrated.twinClass = relatedObjects.twinClassMap[
      dto.twinClassId
    ] as TwinClass_DETAILED;
  }

  return hydrated;
};

/**
 * Shared by the statuses table and the cascading create panel, so both post the
 * very same body.
 */
export function buildTwinStatusCreateRq(
  values: TwinClassStatusFormValues
): TwinStatusCreateRq {
  return {
    key: values.key,
    nameI18n: {
      translationInCurrentLocale: values.name,
      translations: {},
    },
    descriptionI18n: {
      translationInCurrentLocale: values.description,
      translations: {},
    },
    backgroundColor: values.backgroundColor,
    fontColor: values.fontColor,
  };
}
