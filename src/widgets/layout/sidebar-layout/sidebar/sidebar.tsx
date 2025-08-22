"use client";

import { ChevronUp, ChevronsUpDown, Globe, User2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { DomainView_SHORT } from "@/entities/domain";
import { FaceNB001 } from "@/entities/face";
import { DomainUser } from "@/entities/user";
import { useAuthUser } from "@/features/auth";
import { CreateDomainButton } from "@/features/domain";
import { PlatformArea } from "@/shared/config";
import { isUndefined } from "@/shared/libs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SlideView,
  Tabs,
  ThemeImage,
} from "@/shared/ui";

import { SidebarAreaSwitcher } from "./area-switcher";
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

          <SidebarAreaSwitcher
            userLabel={face.userAreaLabel ?? ""}
            adminLabel={face.adminAreaLabel ?? ""}
            area={area}
            setArea={setArea}
          />
        </Tabs>
      );
    }

    return <WorkspaceAreaSidebarMenu items={face.userAreaMenuItems ?? []} />;
  }

  return (
    <nav>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-border h-16 items-center justify-center border-b">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    {currentDomain?.iconLight && currentDomain?.iconDark ? (
                      <ThemeImage
                        className="h-4 w-4 rounded-full"
                        lightSrc={currentDomain?.iconLight}
                        darkSrc={currentDomain?.iconDark}
                        width={56}
                        height={56}
                        alt="Domain logo icon"
                      />
                    ) : (
                      <Globe className="h-4 w-4" />
                    )}
                    {currentDomain?.name ?? "Select Domain"}
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
                  <>
                    {domainsList?.map((domain) => (
                      <DropdownMenuItem
                        key={domain.id}
                        disabled={domain.id === currentDomain?.id}
                        onClick={() => onDomainSwitch(domain)}
                        className="gap-x-2"
                      >
                        {domain.iconLight && domain.iconDark ? (
                          <ThemeImage
                            className="h-4 w-4 rounded-full"
                            lightSrc={domain.iconLight}
                            darkSrc={domain.iconDark}
                            width={56}
                            height={56}
                            alt="Domain logo icon"
                          />
                        ) : (
                          <Globe className="h-4 w-4" />
                        )}
                        <span>{domain.name}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <CreateDomainButton />
                  </>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

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
