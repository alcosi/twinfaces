import { RelatedObjects } from "@/shared/api";
import { PermissionSchema } from "../api";

export const hydratePermissionSchemaFromMap = (
  dto: PermissionSchema,
  relatedObjects?: RelatedObjects
): PermissionSchema => {
  const hydrated: PermissionSchema = Object.assign({}, dto) as PermissionSchema;

  if (dto.createdByUserId && relatedObjects?.userMap) {
    hydrated.createdByUser = relatedObjects.userMap[dto.createdByUserId];
  }

  if (dto.businessAccountId && relatedObjects?.businessAccountMap) {
    hydrated.businessAccount =
      relatedObjects.businessAccountMap[dto.businessAccountId];
  }

  return hydrated;
};
