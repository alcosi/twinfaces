import type { Factory } from "@/entities/factory";
import type { TwinClass_DETAILED } from "@/entities/twin-class";
import type { TwinFlow_DETAILED } from "@/entities/twin-flow";
import { RelatedObjects } from "@/shared/api";

import { TwinFlowFactory, TwinFlowFactory_DETAILED } from "../api";

export const hydrateTwinFlowFactoryFromMap = (
  dto: TwinFlowFactory,
  relatedObjects?: RelatedObjects
): TwinFlowFactory_DETAILED => {
  const hydrated: TwinFlowFactory_DETAILED = Object.assign(
    {},
    dto
  ) as TwinFlowFactory_DETAILED;

  if (dto.twinflowId && relatedObjects?.twinflowMap) {
    hydrated.twinflow = relatedObjects.twinflowMap[
      dto.twinflowId
    ] as TwinFlow_DETAILED;

    if (hydrated.twinflow?.twinClassId && relatedObjects?.twinClassMap) {
      hydrated.twinflow.twinClass = relatedObjects.twinClassMap[
        hydrated.twinflow.twinClassId
      ] as TwinClass_DETAILED;
    }
  }

  if (dto.factoryId && relatedObjects?.factoryMap) {
    hydrated.factory = relatedObjects.factoryMap[dto.factoryId] as Factory;
  }

  return hydrated;
};
