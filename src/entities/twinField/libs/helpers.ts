import { RelatedObjects } from "@/shared/api";
import { TwinFieldType, TwinFieldUI } from "./types";

export const hydrateTwinFieldFromMap = ({
  dto,
  relatedObjects,
  twinClassId,
}: {
  dto: [string, string];
  relatedObjects?: RelatedObjects;
  twinClassId?: string;
}): TwinFieldUI => {
  const [key, value] = dto;

  const twinFieldKeyValue: TwinFieldUI = { key, value } as TwinFieldUI;

  if (!relatedObjects?.twinClassMap || !twinClassId) return twinFieldKeyValue;

  const twinClassField = (
    relatedObjects.twinClassMap[twinClassId]?.fields ?? []
  ).find((field) => field.key === key);

  // NOTE: To support preview state for diff `fieldType`(s)
  switch (twinClassField?.descriptor?.fieldType) {
    case TwinFieldType.selectListV1:
    case TwinFieldType.selectListLongV1:
    case TwinFieldType.selectLongV1:
      twinFieldKeyValue.value =
        relatedObjects?.dataListsOptionMap?.[value] ?? value;
      break;
  }

  return { ...twinFieldKeyValue, ...twinClassField };
};
