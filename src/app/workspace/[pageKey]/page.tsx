import { notFound } from "next/navigation";

import { fetchSidebarFace } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { isUndefined, safe } from "@/shared/libs";
import { LayoutRenderer } from "@/widgets/faces/layouts";

type Props = {
  params: Promise<{
    pageKey: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;

  const { pageKey } = params;

  const page = await resolvePageMenuItem(pageKey);

  if (isUndefined(page?.targetPageFaceId)) return notFound();

  // Face component endpoints require twinId (TWINS-943); for general pages it
  // is the FACE_PAGE twin the navbar menu item points to.
  return (
    <LayoutRenderer
      pageFaceId={page.targetPageFaceId}
      twinId={page.targetTwinId}
    />
  );
}

async function resolvePageMenuItem(pageKey: string) {
  const result = await safe(
    withRedirectOnUnauthorized(() => fetchSidebarFace())
  );

  if (!result.ok) return;

  return result.data.userAreaMenuItems?.find((item) => item.key === pageKey);
}
