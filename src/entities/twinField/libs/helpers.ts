import { RelatedObjects } from "@/shared/api";

import { TwinFieldType, TwinFieldUI } from "./types";

export const hydrateTwinFieldFromMap = ({
  dto,
  relatedObjects,
}: {
  dto: [string, string];
  relatedObjects?: RelatedObjects;
}): TwinFieldUI => {
  const [key, value] = dto;

  const twinFieldKeyValue: TwinFieldUI = { key, value } as TwinFieldUI;

  if (!relatedObjects?.twinClassFieldMap) return twinFieldKeyValue;

  const twinClassField = Object.values(relatedObjects.twinClassFieldMap).find(
    (field) => field.key === key
  );

  // NOTE: To support preview state for diff `fieldType`(s)
  switch (twinClassField?.descriptor?.fieldType) {
    case TwinFieldType.selectListV1:
    case TwinFieldType.selectLongV1:
    case TwinFieldType.selectSharedInHeadV1:
    case TwinFieldType.selectUserV1:
    case TwinFieldType.selectUserLongV1:
    case TwinFieldType.selectLinkV1:
    case TwinFieldType.selectLinkLongV1:
      twinFieldKeyValue.value =
        relatedObjects?.dataListsOptionMap?.[value] ?? value;
      break;
  }

  return { ...twinFieldKeyValue, ...twinClassField };
};
