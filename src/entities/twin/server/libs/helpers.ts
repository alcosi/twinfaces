import { DataListOptionV1 } from "@/entities/datalist-option";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinClassField } from "@/entities/twin-class-field";
import { TwinFlowTransition } from "@/entities/twin-flow-transition";
import { TwinFieldUI, hydrateTwinFieldFromMap } from "@/entities/twinField";
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

  if (dto.fields && relatedObjects?.twinClassFieldMap) {
    hydrated.fields = Object.entries(dto.fields).reduce<
      Record<string, TwinFieldUI>
    >((acc, entry) => {
      const field = hydrateTwinFieldFromMap({ dto: entry, relatedObjects });
      acc[field.key] = field;
      return acc;
    }, {});
  }

  if (dto.attachments && relatedObjects?.twinClassFieldMap) {
    hydrated.fields = hydrated.fields ?? {};

    dto.attachments.forEach((attachment) => {
      const field =
        relatedObjects.twinClassFieldMap?.[attachment.twinClassFieldId!];
      if (field && field.descriptor?.fieldType === "attachmentFieldV1") {
        hydrated.fields![field.key!] = {
          ...(field as Required<TwinClassField>),
          value: attachment.storageLink!,
        };
      }
    });
  }

  return hydrated;
}
