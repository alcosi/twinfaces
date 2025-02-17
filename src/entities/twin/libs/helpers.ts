import { TwinStatus } from "@/entities/twin-status";
import { RelatedObjects } from "@/shared/api";
import { TwinClass_DETAILED } from "../../twinClass";
import { User } from "../../user";
import { Twin, Twin_DETAILED } from "../api";
import { isPopulatedArray, isPopulatedString } from "@/shared/libs";

export const hydrateTwinFromMap = (
  twinDTO: Twin,
  relatedObjects?: RelatedObjects
): Twin_DETAILED => {
  const twin: Twin_DETAILED = Object.assign({}, twinDTO) as Twin_DETAILED;

  if (!relatedObjects?.twinClassMap) return twin;

  if (twinDTO.statusId && relatedObjects.statusMap) {
    twin.status = relatedObjects.statusMap[twinDTO.statusId] as TwinStatus;
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

  if (twinDTO.headTwinId && relatedObjects.twinMap) {
    twin.headTwin = relatedObjects.twinMap[twinDTO.headTwinId];
  }

  return twin;
};

export function formatTwinDisplay({ aliases, name }: Twin): string {
  const aliasText = isPopulatedArray(aliases) ? `${aliases[0]} | ` : "";
  const twinName = isPopulatedString(name) ? `${name}` : "N/A";
  return `${aliasText}${twinName}`;
}
