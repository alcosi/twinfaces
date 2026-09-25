import { z } from "zod";

import { RelatedObjects } from "@/shared/api";

import { Factory, FactoryCreateRq, Factory_DETAILED } from "../api";
import { FACTORY_SCHEMA } from "./schemas";

export const hydrateFactoryFromMap = (
  dto: Factory,
  relatedObjects?: RelatedObjects
): Factory_DETAILED => {
  const hydrated: Factory_DETAILED = Object.assign({}, dto) as Factory_DETAILED;

  if (dto.createdByUserId && relatedObjects?.userMap) {
    hydrated.createdByUser = relatedObjects.userMap[dto.createdByUserId];
  }

  return hydrated;
};

/**
 * Shared by the factories table and the cascading create panel, so both post
 * the very same body.
 */
export function buildFactoryCreateRq(
  values: z.infer<typeof FACTORY_SCHEMA>
): FactoryCreateRq {
  return {
    key: values.key,
    nameI18n: { translations: { en: values.name } },
    descriptionI18n: { translations: { en: values.description } },
  };
}
