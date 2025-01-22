import { RelatedObjects } from "@/shared/api";
import { TwinFieldUI } from "./types";

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

  const initValue: TwinFieldUI = { key, value } as TwinFieldUI;

  if (!relatedObjects?.twinClassMap || !twinClassId) return initValue;

  const twinClassField = (
    relatedObjects.twinClassMap[twinClassId]?.fields ?? []
  ).find((field) => field.key === key);

  return { ...initValue, ...twinClassField };
};
