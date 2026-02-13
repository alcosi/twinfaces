import { User } from "@/entities/user";

import { RelatedObjects } from "../../../shared/api/types";
import { Recipient_DETAILED } from "../api/types";

export const hydrateRecipientFromMap = (
  dto: Recipient_DETAILED,
  relatedObjects?: RelatedObjects
): Recipient_DETAILED => {
  const hydrated: Recipient_DETAILED = Object.assign(
    {},
    dto
  ) as Recipient_DETAILED;

  if (dto.createdByUserId && relatedObjects?.userMap) {
    hydrated.createdByUser = relatedObjects.userMap[
      dto.createdByUserId
    ] as User;
  }

  return hydrated;
};
