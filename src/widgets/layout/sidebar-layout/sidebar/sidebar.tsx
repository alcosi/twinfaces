"use client";

import { ChevronUp, ChevronsUpDown, Globe, User2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { DomainView_SHORT, useDomains } from "@/entities/domain";
import { FaceNB001 } from "@/entities/face";
import { useAuthUser } from "@/features/auth";
import { CreateDomainButton } from "@/features/domain";
import { PlatformArea } from "@/shared/config";
import { isPopulatedArray } from "@/shared/libs";
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
} from "@/shared/ui";

import { SidebarAreaSwitcher } from "./area-switcher";
import { CoreAreaSidebarMenu, WorkspaceAreaSidebarMenu } from "./menu";

type Props = {
  face?: FaceNB001;
};

export function AppSidebar({ face }: Props) {
  const { data } = useDomains();
  const { authUser, updateUser, logout } = useAuthUser();
  const currentDomain = data?.find((i) => i.id === authUser?.domainId);
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
    updateUser({ domainId: domain.id });

    // Reload the page to apply changes (e.g., re-fetching data using the new domainId)
    // TODO: Replace reload with context/state management to avoid full page reloads.
    window.location.reload();
  }

  function onLogout() {
    logout();
    router.replace("/");
  }

  return (
    <nav>
      <Sidebar collapsible="icon">
        <SidebarHeader className="h-16 items-center justify-center border-b border-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Globe className="h-4 w-4" />
                    {currentDomain?.key ?? "Select Domain"}
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
                  <>
                    {data?.map((domain) => (
                      <DropdownMenuItem
                        key={domain.id}
                        disabled={domain.id === currentDomain?.id}
                        onClick={() => onDomainSwitch(domain)}
                      >
                        <span>{domain.key}</span>
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

        <SidebarContent>
          {face ? (
            <Tabs value={area} className="flex h-full flex-col gap-2">
              <section className="grow overflow-y-auto pb-2">
                <SlideView
                  activeIndex={area === PlatformArea.workspace ? 0 : 1}
                >
                  <nav key={PlatformArea.workspace}>
                    {isPopulatedArray(face.userAreaMenuItems) && (
                      <WorkspaceAreaSidebarMenu
                        items={face.userAreaMenuItems}
                      />
                    )}
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
          ) : (
            <CoreAreaSidebarMenu />
          )}
        </SidebarContent>

        <SidebarFooter className="border-t border-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {authUser?.domainUser?.user.fullName}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-(--radix-popper-anchor-width)"
                >
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
