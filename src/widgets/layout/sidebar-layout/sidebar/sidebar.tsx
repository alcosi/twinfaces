"use client";

import { ChevronUp, User2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { DomainView_SHORT } from "@/entities/domain";
import { FaceNB001 } from "@/entities/face";
import { DomainUser } from "@/entities/user";
import { useAuthUser } from "@/features/auth";
import { PlatformArea } from "@/shared/config";
import { isUndefined } from "@/shared/libs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SlideView,
  Tabs,
} from "@/shared/ui";

import { CoreAreaSidebarMenu, WorkspaceAreaSidebarMenu } from "./menu";

type Props = {
  face?: FaceNB001;
  mode?: "user" | "admin";
  currentAuthUser?: DomainUser;
  domainsList?: DomainView_SHORT[];
};

export function AppSidebar({
  face,
  mode = "user",
  currentAuthUser,
  domainsList,
}: Props) {
  const { authUser, setAuthUser, logout } = useAuthUser();
  const currentDomain = domainsList?.find((i) => i.id === authUser?.domainId);

  const router = useRouter();
  const pathname = usePathname();

  // NOTE: Quick fix: infer sidebar area from URL prefix
  // * Doesn't support routes like `/design-system`
  // TODO: Persist area via localStorage or context
  const initialArea: keyof typeof PlatformArea = pathname?.startsWith("/core")
    ? PlatformArea.core
    : PlatformArea.workspace;
  const [area, setArea] = useState<keyof typeof PlatformArea>(initialArea);

  function onDomainSwitch(domain: DomainView_SHORT) {
    if (authUser) {
      setAuthUser({
        authToken: authUser.authToken,
        domainId: domain.id,
        userId: authUser.userId,
      });
    }

    // Reload the page to apply changes (e.g., re-fetching data using the new domainId)
    // TODO: Replace reload with context/state management to avoid full page reloads.
    window.location.reload();
  }

  function onLogout() {
    logout();
    router.replace("/");
  }

  function renderSidebarContent() {
    if (isUndefined(face)) {
      return mode === "admin" && <CoreAreaSidebarMenu />;
    }

    if (mode === "admin") {
      return (
        <Tabs value={area} className="flex h-full flex-col gap-2">
          <section className="grow overflow-y-auto pb-2">
            <SlideView activeIndex={area === PlatformArea.workspace ? 0 : 1}>
              <nav key={PlatformArea.workspace}>
                <WorkspaceAreaSidebarMenu
                  items={face.userAreaMenuItems ?? []}
                />
              </nav>
              <nav key={PlatformArea.core}>
                <CoreAreaSidebarMenu />
              </nav>
            </SlideView>
          </section>
        </Tabs>
      );
    }

    return <WorkspaceAreaSidebarMenu items={face.userAreaMenuItems ?? []} />;
  }

  return (
    <nav>
      <Sidebar collapsible="icon">
        <SidebarContent>{renderSidebarContent()}</SidebarContent>

        <SidebarFooter className="border-border border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 />
                    {currentAuthUser?.user?.fullName}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-(--radix-popper-anchor-width)"
                >
                  <DropdownMenuItem>
                    <SidebarMenuButton onClick={() => router.push("/profile")}>
                      Profile
                    </SidebarMenuButton>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SidebarMenuButton onClick={onLogout}>
                      Log out
                    </SidebarMenuButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </nav>
  );
}
