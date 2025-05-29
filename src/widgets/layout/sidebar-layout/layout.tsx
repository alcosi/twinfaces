import { PropsWithChildren } from "react";

import {
  FaceNB001,
  FaceNB001MenuItem,
  fetchSidebarFace,
  getAuthHeaders,
} from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { isGranted } from "@/entities/user/server";
import { safe } from "@/shared/libs";
import { RenderOnClient, SidebarProvider } from "@/shared/ui";

import { SidebarLayoutContent } from "./content";
import { SidebarLayoutHeader } from "./header";
import { AppSidebar } from "./sidebar";

type Props = PropsWithChildren<{}>;

async function filterAccessibleMenuItems(
  items: FaceNB001MenuItem[],
  userId: string
): Promise<FaceNB001MenuItem[]> {
  const result: FaceNB001MenuItem[] = [];

  for (const item of items) {
    const { guardedByPermissionId, children } = item;
    const hasAccess = guardedByPermissionId
      ? await isGranted({ userId, permission: guardedByPermissionId })
      : true;

    if (!hasAccess) continue;

    const filteredChildren = children
      ? await filterAccessibleMenuItems(children, userId)
      : [];

    result.push({ ...item, children: filteredChildren });
  }

  return result;
}

export async function SidebarLayout({ children }: Props) {
  const { currentUserId } = await getAuthHeaders();
  const isAdmin = await isGranted({
    userId: currentUserId,
    permission: KEY_TO_ID_PERMISSION_MAP.DOMAIN_MANAGE,
  });

  const faceResult = await safe(fetchSidebarFace);
  let sidebarFace: FaceNB001 | undefined = faceResult.ok
    ? faceResult.data
    : undefined;

  if (sidebarFace?.userAreaMenuItems) {
    sidebarFace = {
      ...sidebarFace,
      userAreaMenuItems: await filterAccessibleMenuItems(
        sidebarFace.userAreaMenuItems,
        currentUserId
      ),
    };
  }

  return (
    <SidebarProvider>
      <RenderOnClient>
        <AppSidebar face={sidebarFace} mode={isAdmin ? "admin" : undefined} />
        <div className="w-full">
          <SidebarLayoutHeader />
          <SidebarLayoutContent>{children}</SidebarLayoutContent>
        </div>
      </RenderOnClient>
    </SidebarProvider>
  );
}
