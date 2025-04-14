import { RelatedObjects } from "@/shared/api";

import { DomainUser, DomainUser_DETAILED } from "../../api";

export const hydrateDomainUserFromMap = (
  dto: DomainUser,
  relatedObjects?: RelatedObjects
): DomainUser_DETAILED => {
  const hydrated: DomainUser_DETAILED = Object.assign(
    {},
    dto
  ) as DomainUser_DETAILED;

  if (dto.userId && relatedObjects?.userMap) {
    hydrated.user = relatedObjects.userMap[dto.userId]!;
  }

  return hydrated;
};
