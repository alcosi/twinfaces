import { TwinStatus } from "@/entities/twin-status";
import { RelatedObjects } from "@/shared/api";
import { TwinClass_DETAILED } from "../../twinClass";
import { User } from "../../user";
import { Twin, Twin_DETAILED } from "../api";
import { isPopulatedArray, isPopulatedString } from "@/shared/libs";
import { DataListOptionV1 } from "@/entities/datalist-option";

export const hydrateTwinFromMap = (
  dto: Twin,
  relatedObjects?: RelatedObjects
): Twin_DETAILED => {
  const hydrated: Twin_DETAILED = Object.assign({}, dto) as Twin_DETAILED;

  if (!relatedObjects?.twinClassMap) return hydrated;

  if (dto.statusId && relatedObjects.statusMap) {
    hydrated.status = relatedObjects.statusMap[dto.statusId] as TwinStatus;
  }

  if (dto.twinClassId) {
    hydrated.twinClass = relatedObjects.twinClassMap[
      dto.twinClassId
    ] as TwinClass_DETAILED;
  }

  if (dto.authorUserId && relatedObjects.userMap) {
    hydrated.authorUser = relatedObjects.userMap[dto.authorUserId] as User;
  }

  if (dto.assignerUserId && relatedObjects.userMap) {
    hydrated.assignerUser = relatedObjects.userMap[dto.assignerUserId] as User;
  }

  if (dto.headTwinId && relatedObjects.twinMap) {
    hydrated.headTwin = relatedObjects.twinMap[dto.headTwinId];
  }

  if (dto.tagIdList && relatedObjects.dataListsOptionMap) {
    hydrated.tags = dto.tagIdList.map<DataListOptionV1>(
      (id) => relatedObjects.dataListsOptionMap![id]!
    );
  }

  return hydrated;
};

export function formatTwinDisplay({ aliases, name }: Twin): string {
  const aliasText = isPopulatedArray(aliases) ? `${aliases[0]} | ` : "";
  const twinName = isPopulatedString(name) ? `${name}` : "N/A";
  return `${aliasText}${twinName}`;
}
