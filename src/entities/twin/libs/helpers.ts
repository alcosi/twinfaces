import { TwinClassStatus } from "@/entities/twinClassStatus";
import { RelatedObjects } from "@/shared/api";
import { TwinClass_DETAILED } from "../../twinClass";
import { User } from "../../user";
import { Twin } from "../api";

export const hydrateTwinFromMap = (
  twinDTO: Twin,
  relatedObjects?: RelatedObjects
): Twin => {
  const twin: Twin = Object.assign({}, twinDTO) as Twin;

  if (!relatedObjects?.twinClassMap) return twin;

  if (twinDTO.statusId && relatedObjects.statusMap) {
    twin.status = relatedObjects.statusMap[twinDTO.statusId] as TwinClassStatus;
  }

  if (twinDTO.twinClassId) {
    twin.twinClass = relatedObjects.twinClassMap[
      twinDTO.twinClassId
    ] as TwinClass_DETAILED;
  }

  if (twinDTO.authorUserId && relatedObjects.userMap) {
    twin.authorUser = relatedObjects.userMap[twinDTO.authorUserId] as User;
  }

  if (twinDTO.assignerUserId && relatedObjects.userMap) {
    twin.assignerUser = relatedObjects.userMap[twinDTO.assignerUserId] as User;
  }

  return twin;
};
