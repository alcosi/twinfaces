import { DataListOptionV1 } from "@/entities/datalist-option";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinFlowTransition } from "@/entities/twin-flow-transition";
import { TwinFieldUI } from "@/entities/twinField";
import { RelatedObjects } from "@/shared/api";

import { Twin, Twin_HYDRATED } from "../api";

export function hydrateTwinFromMap<T extends Twin_HYDRATED>(
  dto: Twin,
  relatedObjects?: RelatedObjects
): T {
  const hydrated = { ...dto } as T;

  if (!relatedObjects?.twinClassMap) return hydrated;

  if (dto.statusId && relatedObjects.statusMap) {
    hydrated.status = relatedObjects.statusMap[dto.statusId];
  }

  if (dto.twinClassId) {
    hydrated.twinClass = relatedObjects.twinClassMap[
      dto.twinClassId
    ] as TwinClass_DETAILED;
  }

  if (dto.authorUserId && relatedObjects.userMap) {
    hydrated.authorUser = relatedObjects.userMap[dto.authorUserId];
  }

  if (dto.assignerUserId && relatedObjects.userMap) {
    hydrated.assignerUser = relatedObjects.userMap[dto.assignerUserId];
  }

  if (dto.ownerUserId && relatedObjects.userMap) {
    hydrated.ownerUser = relatedObjects.userMap[dto.ownerUserId];
  }

  if (dto.headTwinId && relatedObjects.twinMap) {
    hydrated.headTwin = relatedObjects.twinMap[dto.headTwinId];
  }

  if (dto.tagIdList && relatedObjects.dataListsOptionMap) {
    hydrated.tags = dto.tagIdList.reduce<DataListOptionV1[]>((acc, id) => {
      const tag = relatedObjects.dataListsOptionMap?.[id];
      if (tag) acc.push(tag);

      return acc;
    }, []);
  }

  if (dto.transitionsIdList && relatedObjects.transitionsMap) {
    hydrated.transitions = dto.transitionsIdList.reduce<TwinFlowTransition[]>(
      (acc, id) => {
        const transition = relatedObjects.transitionsMap?.[id];
        if (transition) acc.push(transition);

        return acc;
      },
      []
    );
  }

  if (dto.fields && relatedObjects.twinClassFieldMap) {
    hydrated.fieldsTest = {};
    for (const [key, value] of Object.entries(dto.fields)) {
      const twinClassField = Object.values(
        relatedObjects.twinClassFieldMap
      ).find((field) => field.key === key);

      let fieldValue: any;
      if (
        typeof value === "string" &&
        relatedObjects.dataListsOptionMap?.[value]
      ) {
        fieldValue = relatedObjects.dataListsOptionMap[value];
      } else {
        fieldValue = value ?? "";
      }

      hydrated.fieldsTest[key] = {
        ...twinClassField,
        value: fieldValue,
      } as TwinFieldUI;
    }
  }

  return hydrated;
}
