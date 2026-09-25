import { z } from "zod";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinStatus_DETAILED } from "@/entities/twin-status";
import { User_DETAILED } from "@/entities/user";
import { RelatedObjects } from "@/shared/api";

import { TwinFlow, TwinFlowCreateRq, TwinFlow_DETAILED } from "../api";
import { TWIN_FLOW_SCHEMA } from "./schema";

export const hydrateTwinFlowFromMap = (
  dto: TwinFlow,
  relatedObjects?: RelatedObjects
): TwinFlow_DETAILED => {
  const hydrated: TwinFlow_DETAILED = Object.assign(
    {},
    dto
  ) as TwinFlow_DETAILED;

  if (dto.initialStatusId && relatedObjects?.statusMap) {
    hydrated.initialStatus = relatedObjects.statusMap[
      dto.initialStatusId
    ] as TwinStatus_DETAILED;
  }

  if (dto.createdByUserId && relatedObjects?.userMap) {
    hydrated.createdByUser = relatedObjects.userMap[
      dto.createdByUserId
    ] as User_DETAILED;
  }

  if (dto.twinClassId && relatedObjects?.twinClassMap) {
    hydrated.twinClass = relatedObjects.twinClassMap[
      dto.twinClassId
    ] as TwinClass_DETAILED;
  }

  if (dto.initialSketchStatusId && relatedObjects?.statusMap) {
    hydrated.initialSketchStatus = relatedObjects.statusMap[
      dto.initialSketchStatusId
    ] as TwinStatus_DETAILED;
  }

  return hydrated;
};

/**
 * Shared by the twinflows table and the cascading create panel, so both post
 * the very same body.
 */
export function buildTwinFlowCreateRq(
  values: z.infer<typeof TWIN_FLOW_SCHEMA>
): TwinFlowCreateRq {
  return {
    nameI18n: {
      translationInCurrentLocale: values.name,
      translations: {},
    },
    descriptionI18n: {
      translationInCurrentLocale: values.description,
      translations: {},
    },
    initialStatusId: values.initialStatus,
  };
}
