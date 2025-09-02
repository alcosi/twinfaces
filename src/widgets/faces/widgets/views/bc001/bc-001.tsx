import { fetchBC001Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { ServerBreadcrumbHeader } from "@/features/ui/headers";
import { RelatedObjects } from "@/shared/api";
import { isPopulatedArray, isTruthy, safe } from "@/shared/libs";

type Props = {
  breadCrumbsFaceId: string;
  twinId: string;
  relatedObjects: RelatedObjects;
};

export async function BC001({
  breadCrumbsFaceId,
  twinId,
  relatedObjects,
}: Props) {
  const breadCrumbsResult = await safe(
    withRedirectOnUnauthorized(() => fetchBC001Face(breadCrumbsFaceId, twinId))
  );

  if (!breadCrumbsResult.ok) {
    console.error(`Failed to load bread crumbs data:`, breadCrumbsResult.error);
    return undefined;
  }

  const breadCrumbsFace = relatedObjects.faceMap?.[breadCrumbsFaceId!];
  const breadCrumbsData = isTruthy(breadCrumbsFace)
    ? breadCrumbsResult.data.breadCrumbs
    : undefined;
  const sortedBreadCrumbsData = breadCrumbsData?.items?.sort(
    (b, a) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    isPopulatedArray(sortedBreadCrumbsData) && (
      <ServerBreadcrumbHeader items={sortedBreadCrumbsData} />
    )
  );
}
