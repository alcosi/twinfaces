import { DataListOptionV1 } from "@/entities/datalist-option";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinClassField } from "@/entities/twin-class-field";
import { TwinFlowTransition } from "@/entities/twin-flow-transition";
import { TwinFieldUI } from "@/entities/twinField";
import { RelatedObjects } from "@/shared/api";
import { isPopulatedString } from "@/shared/libs";

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
    const KEY_TO_TWIN_CLASS_FIELD_MAP = Object.values(
      relatedObjects.twinClassFieldMap
    ).reduce<Record<string, TwinClassField>>((acc, field) => {
      if (field.key) acc[field.key] = field;
      return acc;
    }, {});

    hydrated.fields = Object.entries(dto.fields).reduce<
      Record<string, TwinFieldUI>
    >((acc, [key, value]) => {
      const twinClassField = KEY_TO_TWIN_CLASS_FIELD_MAP[key];

      // ??? extract to function
      // TODO: test if dataListsOptionMap & twinMap work without bugs
      let fieldValue = "";

      if (twinClassField?.descriptor?.fieldType === "textV1") {
        fieldValue = value;
      }

      if (
        twinClassField?.descriptor?.fieldType === "selectListV1" ||
        twinClassField?.descriptor?.fieldType === "selectLongV1" ||
        twinClassField?.descriptor?.fieldType === "selectSharedInHeadV1"
      ) {
        fieldValue = isPopulatedString(value)
          ? relatedObjects.dataListsOptionMap?.[value]
          : " ";
      }

      if (
        twinClassField?.descriptor?.fieldType === "selectLinkV1" ||
        twinClassField?.descriptor?.fieldType === "selectLinkLongV1"
      ) {
        fieldValue = isPopulatedString(value)
          ? relatedObjects.twinMap?.[value]
          : " ";
      }

      acc[key] = {
        ...twinClassField,
        value: fieldValue,
      } as TwinFieldUI;

      return acc;
    }, {});
  }

  if (dto.attachments && relatedObjects?.twinClassFieldMap) {
    const attachmentField = Object.values(
      relatedObjects.twinClassFieldMap
    ).find((f) => f.descriptor?.fieldType === "attachmentFieldV1");

    if (attachmentField) {
      hydrated.fields = hydrated.fields ?? {};
      hydrated.fields[attachmentField.key!] = {
        ...(attachmentField as Required<TwinClassField>),
        value: dto.attachments[0]?.storageLink ?? "",
      };
    }
  }

  return hydrated;
}
