import { notFound } from "next/navigation";
import { ReactNode } from "react";
import React from "react";

import { getAuthHeaders } from "@/entities/face";
import { Twin_DETAILED, fetchTwinById } from "@/entities/twin/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { UrlBreadcrumbHeader } from "@/features/ui/headers";
import { safe } from "@/shared/libs";
import { BC001 } from "@/widgets/faces/widgets/views/bc001";
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

  return (
    <PrivateLayoutProviders>
      <>
        {twin.breadCrumbsFaceId ? (
          <BC001
            breadCrumbsFaceId={twin.breadCrumbsFaceId}
            twinId={twin.id}
            relatedObjects={relatedObjects}
          />
        ) : (
          <UrlBreadcrumbHeader />
        )}
        {children}
      </>
    </PrivateLayoutProviders>
  );
}
