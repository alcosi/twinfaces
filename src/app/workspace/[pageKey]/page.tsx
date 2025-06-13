import { fetchSidebarFace } from "@/entities/face";
import { UnderConstructionScreen as UnderConstruction } from "@/screens/under-construction";
import { isUndefined, safeWithRedirect } from "@/shared/libs";
import { LayoutRenderer } from "@/widgets/faces/layouts";

type Props = {
  params: {
    pageKey: string;
  };
};

export default async function Page({ params: { pageKey } }: Props) {
  const pageFaceId = await resolvePageFaceId(pageKey);

  if (isUndefined(pageFaceId)) return <UnderConstruction />;

  return <LayoutRenderer pageFaceId={pageFaceId} />;
}

async function resolvePageFaceId(pageKey: string): Promise<string | undefined> {
  const result = await safeWithRedirect(fetchSidebarFace);
  if (!result.ok) return;

  const page = result.data.userAreaMenuItems?.find(
    (item) => item.key === pageKey
  );

  return page?.targetPageFaceId;
}
