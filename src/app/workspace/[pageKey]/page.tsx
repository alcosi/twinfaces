import { notFound } from "next/navigation";

import { fetchSidebarFace } from "@/entities/face";
import { isUndefined, safe } from "@/shared/libs";
import { LayoutRenderer } from "@/widgets/faces/layouts";

type Props = {
  params: {
    pageKey: string;
  };
};

export default async function Page({ params: { pageKey } }: Props) {
  const pageFaceId = await resolvePageFaceId(pageKey);

  if (isUndefined(pageFaceId)) return notFound();

  return <LayoutRenderer pageFaceId={pageFaceId} />;
}

async function resolvePageFaceId(pageKey: string): Promise<string | undefined> {
  const result = await safe(fetchSidebarFace);
  if (!result.ok) return;

  const page = result.data.userAreaMenuItems?.find(
    (item) => item.key === pageKey
  );

  return page?.targetPageFaceId;
}
