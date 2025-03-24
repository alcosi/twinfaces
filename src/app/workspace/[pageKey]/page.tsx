import { notFound } from "next/navigation";

import { fetchSidebarFace } from "@/entities/face";
import { isUndefined } from "@/shared/libs";
import { PG001Face } from "@/widgets/faces/pg001";

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

  return <PG001Face pageFaceId={pageFace.targetPageFaceId} />;
}
