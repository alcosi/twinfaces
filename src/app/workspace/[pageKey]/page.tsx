import { notFound } from "next/navigation";

import { FaceNB001MenuItem, fetchSidebarFace } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { isUndefined, safe, slugify } from "@/shared/libs";
import { LayoutRenderer } from "@/widgets/faces/layouts";
import { PersonnelUsersTable } from "@/widgets/tables/users/personnel-users-table";

type Props = {
  params: Promise<{
    pageKey: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;

  const { pageKey } = params;

  // Personnel is a real-user-accounts screen backed by the domain users
  // endpoint, not a face-configured twins table.
  if (pageKey === "personnel") return <PersonnelUsersTable />;

  const pageFaceId = await resolvePageFaceId(pageKey);

  if (isUndefined(pageFaceId)) return notFound();

  return <LayoutRenderer pageFaceId={pageFaceId} />;
}

async function resolvePageFaceId(pageKey: string): Promise<string | undefined> {
  const result = await safe(
    withRedirectOnUnauthorized(() => fetchSidebarFace())
  );

  if (!result.ok) return;

  return findMenuItem(result.data.userAreaMenuItems, pageKey)?.targetPageFaceId;
}

function findMenuItem(
  items: FaceNB001MenuItem[] | undefined,
  pageKey: string
): FaceNB001MenuItem | undefined {
  for (const item of items ?? []) {
    if (item.key === pageKey || slugify(item.key) === pageKey) {
      return item;
    }

    const nested = findMenuItem(item.children, pageKey);
    if (nested) return nested;
  }

  return undefined;
}
