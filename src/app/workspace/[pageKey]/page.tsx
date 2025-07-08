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

  const pageFaceId = await resolvePageFaceId(pageKey);

  if (isUndefined(pageFaceId)) return notFound();

  return <LayoutRenderer pageFaceId={pageFaceId} />;
}

async function resolvePageFaceId(pageKey: string): Promise<string | undefined> {
  const result = await safe(
    withRedirectOnUnauthorized(() => fetchSidebarFace())
  );
  if (!result.ok) return;

  const page = result.data.userAreaMenuItems?.find(
    (item) => item.key === pageKey
  );

  return page?.targetPageFaceId;
}
