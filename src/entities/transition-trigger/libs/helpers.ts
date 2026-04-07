import { TwinFlowTransition_DETAILED } from "@/entities/twin-flow-transition";
import { TwinTrigger_DETAILED } from "@/entities/twin-trigger";
import { RelatedObjects } from "@/shared/api";

import { TransitionTrigger, TransitionTrigger_DETAILED } from "../api/types";

export const hydrateTransitionTriggerFromMap = (
  dto: TransitionTrigger,
  relatedObjects?: RelatedObjects
): TransitionTrigger_DETAILED => {
  const hydrated: TransitionTrigger_DETAILED = Object.assign(
    {},
    dto
  ) as TransitionTrigger_DETAILED;

  if (dto.twinTriggerId && relatedObjects?.triggerMap) {
    hydrated.twinTrigger = relatedObjects.triggerMap[
      dto.twinTriggerId
    ] as TwinTrigger_DETAILED;
  }

  if (dto.twinflowTransitionId && relatedObjects?.transitionsMap) {
    hydrated.twinflowTransition = relatedObjects.transitionsMap[
      dto.twinflowTransitionId
    ] as TwinFlowTransition_DETAILED;
  }

  return hydrated;
};
