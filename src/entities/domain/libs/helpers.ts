import { RelatedObjects } from "@/shared/api";

import { DomainView, DomainView_DETAILED } from "../api";

export const hydrateDomainView = (
  dto: DomainView,
  relatedObjects?: RelatedObjects
): DomainView_DETAILED => {
  const hydrated: DomainView_DETAILED = Object.assign(
    {},
    dto
  ) as DomainView_DETAILED;

  // TODO: Add hydration logic here

  // if (dto.navbarFaceId && relatedObjects?.faceMap) {
  //   hydrated.navbarFace = relatedObjects.faceMap[dto.navbarFaceId];
  // }

  return hydrated;
};
