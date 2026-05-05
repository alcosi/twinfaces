import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { Twin_DETAILED } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { RelatedObjects } from "@/shared/api";

import { History, History_DETAILED } from "../api";

export const hydrateHistoryFromMap = (
  dto: History,
  relatedObjects?: RelatedObjects
): History_DETAILED => {
  const hydrated: History_DETAILED = Object.assign({}, dto) as History_DETAILED;

  if (dto.machineUserId && relatedObjects?.userMap) {
    hydrated.machineUser = relatedObjects.userMap[dto.machineUserId] as User;
  }

  if (dto.actorUserId && relatedObjects?.userMap) {
    hydrated.actorUser = relatedObjects.userMap[dto.actorUserId] as User;
  }

  if (dto.twinClassFieldId && relatedObjects?.twinClassFieldMap) {
    hydrated.twinClassField = relatedObjects.twinClassFieldMap[
      dto.twinClassFieldId
    ] as TwinClassField_DETAILED;
  }

  if (dto.twinId && relatedObjects?.twinMap) {
    hydrated.twin = relatedObjects.twinMap[dto.twinId] as Twin_DETAILED;
  }

  return hydrated;
};
