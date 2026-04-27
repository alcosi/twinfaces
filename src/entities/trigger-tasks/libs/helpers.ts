import { BusinessAccount } from "@/entities/business-account";
import { TriggerTask, TriggerTask_DETAILED } from "@/entities/trigger-tasks";
import { TwinStatus } from "@/entities/twin-status";
import { TwinTrigger_DETAILED } from "@/entities/twin-trigger";
import { Twin_DETAILED } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { RelatedObjects } from "@/shared/api";

export const hydrateTriggerTaskFromMap = (
  dto: TriggerTask,
  relatedObjects?: RelatedObjects
): TriggerTask_DETAILED => {
  const hydrated: TriggerTask_DETAILED = Object.assign(
    {},
    dto
  ) as TriggerTask_DETAILED;

  if (dto.twinId && relatedObjects?.twinMap) {
    hydrated.twin = relatedObjects.twinMap[dto.twinId] as Twin_DETAILED;
  }

  if (dto.twinTriggerId && relatedObjects?.triggerMap) {
    hydrated.twinTrigger = relatedObjects.triggerMap[
      dto.twinTriggerId
    ] as TwinTrigger_DETAILED;
  }

  if (dto.createdByUserId && relatedObjects?.userMap) {
    hydrated.createdByUser = relatedObjects.userMap[
      dto.createdByUserId
    ] as User;
  }

  if (dto.businessAccountId && relatedObjects?.businessAccountMap) {
    hydrated.businessAccount = relatedObjects.businessAccountMap[
      dto.businessAccountId
    ] as BusinessAccount;
  }

  if (dto.previousTwinStatusId && relatedObjects?.statusMap) {
    hydrated.previousTwinStatus = relatedObjects.statusMap[
      dto.previousTwinStatusId
    ] as TwinStatus;
  }

  return hydrated;
};
