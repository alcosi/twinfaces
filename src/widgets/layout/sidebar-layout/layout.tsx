import { PropsWithChildren } from "react";

import { fetchDomainsList, hydrateDomainView } from "@/entities/domain";
import {
  FaceNB001,
  FaceNB001MenuItem,
  fetchSidebarFace,
  getAuthHeaders,
} from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import {
  getAuthenticatedUser,
  isAuthUserGranted,
} from "@/entities/user/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
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
      ? await isAuthUserGranted({ permission: guardedByPermissionId })
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

  const result = await safe(withRedirectOnUnauthorized(fetchDomainsList));
  const domains = result.ok ? result.data.domains : [];

  const isAdmin = await isAuthUserGranted({
    permission: KEY_TO_ID_PERMISSION_MAP.DOMAIN_MANAGE,
  });

  const faceResult = await safe(withRedirectOnUnauthorized(fetchSidebarFace));

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

  const { DomainId, AuthToken } = await getAuthHeaders();

  const authUser = await getAuthenticatedUser({
    domainId: DomainId,
    authToken: AuthToken,
  });

  return (
    <SidebarProvider>
      <RenderOnClient>
        <div className="flex w-full flex-col">
          <SidebarLayoutHeader currentAuthUser={authUser} />

          <div className="flex">
            <AppSidebar
              face={sidebarFace}
              mode={isAdmin ? "admin" : undefined}
              currentAuthUser={authUser}
              domainsList={domains?.map((dto) => hydrateDomainView(dto)) ?? []}
            />
            <div className="w-full">
              <SidebarLayoutContent>{children}</SidebarLayoutContent>
            </div>
          </div>
        </div>
      </RenderOnClient>
    </SidebarProvider>
  );
}
