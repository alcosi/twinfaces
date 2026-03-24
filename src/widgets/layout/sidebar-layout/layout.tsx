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
  getAuthPermissionSnapshot,
  getAuthenticatedUser,
  isAuthUserGranted,
} from "@/entities/user/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { PermissionsAccessProvider, safe } from "@/shared/libs";
import { RenderOnClient, SidebarProvider } from "@/shared/ui";

import { SidebarLayoutContent } from "./content";
import { AppSidebar } from "./sidebar";

type Props = PropsWithChildren<{}>;

async function filterAccessibleMenuItems(
  items: FaceNB001MenuItem[],
  grantedPermissionIds: Set<string>
): Promise<FaceNB001MenuItem[]> {
  const result: FaceNB001MenuItem[] = [];

  for (const item of items) {
    const { guardedByPermissionId, children } = item;
    const hasAccess = guardedByPermissionId
      ? grantedPermissionIds.has(guardedByPermissionId)
      : true;

    if (!hasAccess) continue;

    const filteredChildren = children
      ? await filterAccessibleMenuItems(children, grantedPermissionIds)
      : [];

    result.push({ ...item, children: filteredChildren });
  }

  return result;
}

export async function SidebarLayout({ children }: Props) {
  await getAuthHeaders();
  const permissionSnapshot = await getAuthPermissionSnapshot();

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
        permissionSnapshot.ids
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
      <PermissionsAccessProvider permissionKeys={[...permissionSnapshot.keys]}>
        <RenderOnClient>
          <AppSidebar
            face={sidebarFace}
            mode={isAdmin ? "admin" : undefined}
            currentAuthUser={authUser}
            domainsList={domains?.map((dto) => hydrateDomainView(dto)) ?? []}
          />
          <div className="w-full">
            <SidebarLayoutContent>{children}</SidebarLayoutContent>
          </div>
        </RenderOnClient>
      </PermissionsAccessProvider>
    </SidebarProvider>
  );
}
