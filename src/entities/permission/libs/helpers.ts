import { z } from "zod";

import { RelatedObjects } from "@/shared/api";

import {
  CreatePermissionRequestBody,
  Permission,
  Permission_DETAILED,
} from "../api";
import { PERMISSION_SCHEMA } from "./constants";

export const hydratePermissionFromMap = (
  dto: Permission,
  relatedObjects?: RelatedObjects
): Permission_DETAILED => {
  const hydrated: Permission_DETAILED = Object.assign(
    {},
    dto
  ) as Permission_DETAILED;

  if (dto.groupId && relatedObjects?.permissionGroupMap) {
    hydrated.group = relatedObjects.permissionGroupMap[dto.groupId]!;
  }

  return hydrated;
};

/**
 * Shared by the permissions table and the cascading create panel, so both post
 * the very same body.
 */
export function buildPermissionCreateRq(
  values: z.infer<typeof PERMISSION_SCHEMA>
): CreatePermissionRequestBody {
  return {
    groupId: values.groupId,
    key: values.key,
    nameI18n: { translations: { en: values.name } },
    descriptionI18n: values.description
      ? { translations: { en: values.description } }
      : undefined,
  };
}
