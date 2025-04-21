import { PropsWithChildren } from "react";

import {
  FaceNB001,
  FaceNB001MenuItem,
  fetchSidebarFace,
  getAuthHeaders,
} from "@/entities/face";
import { isGranted } from "@/entities/user/server";
import { safe } from "@/shared/libs";
import { RenderOnClient, SidebarProvider } from "@/shared/ui";

import { SidebarLayoutContent } from "./content";
import { SidebarLayoutHeader } from "./header";
import { AppSidebar } from "./sidebar";

type Props = PropsWithChildren<{}>;

async function resolveAccessibleMenuItems(
  items: FaceNB001MenuItem[],
  userId: string
): Promise<FaceNB001MenuItem[]> {
  const result: FaceNB001MenuItem[] = [];

  for (const item of items) {
    const permission = item.guardedByPermissionId;
    const hasAccess = permission
      ? await isGranted({ userId, permission })
      : true;

    if (!hasAccess) continue;

    const filteredChildren = item.children
      ? await resolveAccessibleMenuItems(item.children, userId)
      : [];

    result.push({ ...item, children: filteredChildren });
  }

  return result;
}

async function getSidebarFace(): Promise<FaceNB001 | undefined> {
  const result = await safe(fetchSidebarFace);
  const face = result.ok ? result.data : undefined;

  if (face?.userAreaMenuItems) {
    const { currentUserId } = await getAuthHeaders();
    const menuItems = await resolveAccessibleMenuItems(
      face.userAreaMenuItems,
      currentUserId
    );

    return {
      ...face,
      userAreaMenuItems: menuItems,
    };
  }

  return face;
}

export async function SidebarLayout({ children }: Props) {
  const face = await getSidebarFace();

  return (
    <SidebarProvider>
      <RenderOnClient>
        <AppSidebar face={face} />
        <div className="w-full">
          <SidebarLayoutHeader />
          <SidebarLayoutContent>{children}</SidebarLayoutContent>
        </div>
      </RenderOnClient>
    </SidebarProvider>
  );
}
