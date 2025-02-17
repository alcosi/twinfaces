import { RelatedObjects } from "@/shared/api";
import { DomainView, DomainView_SHORT } from "../api";

export const hydrateDomainView = (
  dto: DomainView,
  relatedObjects?: RelatedObjects
): DomainView_SHORT => {
  const hydrated: DomainView_SHORT = Object.assign({}, dto) as DomainView_SHORT;

  // TODO: Add hydration logic here

  return hydrated;
};
