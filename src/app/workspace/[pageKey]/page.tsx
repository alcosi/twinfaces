import { notFound } from "next/navigation";

import { FaceNB001MenuItem, fetchSidebarFace } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { isUndefined, safe, slugify } from "@/shared/libs";
import { TwinPageRenderer } from "@/widgets/faces/layouts";
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

  const page = await resolvePageMenuItem(pageKey);

  // A disabled item is not selectable in the menu, so its page is not
  // reachable by a typed-in URL either.
  if (isUndefined(page?.targetTwinId) || page.disabled) return notFound();

  // The menu item points to a FACE_PAGE twin; the page face is the one that
  // twin resolves to.
  return <TwinPageRenderer twinId={page.targetTwinId} />;
}

async function resolvePageMenuItem(pageKey: string) {
  const result = await safe(
    withRedirectOnUnauthorized(() => fetchSidebarFace())
  );

  if (!result.ok) return;

  return findMenuItem(result.data.userAreaMenuItems, pageKey);
}

// The sidebar links every menu item — nested ones included — as
// `/workspace/{slugify(key)}`, so the lookup descends into children and
// matches either the raw key or its slug.
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
