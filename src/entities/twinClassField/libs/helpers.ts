import { RelatedObjects } from "@/shared/api";
import { TwinClassField, TwinClassField_DETAILED } from "../api";

export const hydrateTwinclassfieldFromMap = (
  twinClassFieldDTO: TwinClassField,
  relatedObjects?: RelatedObjects
): TwinClassField_DETAILED => {
  const TwinClassField: TwinClassField_DETAILED = Object.assign(
    {},
    twinClassFieldDTO
  ) as TwinClassField_DETAILED;

  // TODO: Add hydration logic here

  return TwinClassField;
};
