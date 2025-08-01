import { notFound } from "next/navigation";
import { ReactNode } from "react";
import React from "react";

import { fetchBC001Face, getAuthHeaders } from "@/entities/face";
import { Twin_DETAILED, fetchTwinById } from "@/entities/twin/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import {
  ServerBreadcrumbHeader,
  UrlBreadcrumbHeader,
} from "@/features/ui/headers";
import { isPopulatedArray, isTruthy, safe } from "@/shared/libs";
import { PrivateLayoutProviders } from "@/widgets/layout";

type Props = {
  children: ReactNode;
  params: { twinId: string };
};

export default async function Layout({ children, params }: Props) {
  const { twinId } = await params;
  const header = await getAuthHeaders();
  const query = {
    showTwinMode: "DETAILED",
    showTwin2TwinClassMode: "DETAILED",
    showTwinClassPage2FaceMode: "DETAILED",
    showTwin2FaceMode: "DETAILED",
  } as const;

  const twinResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchTwinById<Twin_DETAILED>(twinId, { header, query })
    )
  );

  if (!twinResult.ok) notFound();

  const { twin, relatedObjects } = twinResult.data;

  const breadCrumbsResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchBC001Face(twin.breadCrumbsFaceId!, twin.id)
    )
  );

  if (!breadCrumbsResult.ok) {
    console.error(`Failed to load bread crumbs data:`, breadCrumbsResult.error);
    return undefined;
  }

  const breadCrumbsFace = relatedObjects.faceMap?.[twin.breadCrumbsFaceId!];
  const breadCrumbsData = isTruthy(breadCrumbsFace)
    ? breadCrumbsResult.data.breadCrumbs
    : undefined;
  const sortedBreadCrumbsData = breadCrumbsData?.items?.sort(
    (b, a) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    <PrivateLayoutProviders>
      <>
        {isPopulatedArray(sortedBreadCrumbsData) ? (
          <ServerBreadcrumbHeader items={sortedBreadCrumbsData} />
        ) : (
          <UrlBreadcrumbHeader />
        )}
        {children}
      </>
    </PrivateLayoutProviders>
  );
}
