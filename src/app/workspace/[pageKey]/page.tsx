import { notFound } from "next/navigation";

import { fetchSidebarFace } from "@/entities/face";
import { isUndefined } from "@/shared/libs";
import { LayoutRenderer } from "@/widgets/faces/layouts";

type Props = {
  params: {
    pageKey: string;
  };
};

export default async function Page({ params: { pageKey } }: Props) {
  const sidebarFace = await fetchSidebarFace();
  const pageFace = sidebarFace.userAreaMenuItems?.find(
    (item) => item.key === pageKey
  );

  if (isUndefined(pageFace?.targetPageFaceId)) {
    return notFound();
  }

  return <LayoutRenderer pageFaceId={pageFace.targetPageFaceId} />;
}
