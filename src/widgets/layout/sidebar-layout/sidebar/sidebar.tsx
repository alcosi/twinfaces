"use client";

import { DomainView_SHORT, useDomains } from "@/entities/domain";
import { useAuthUser } from "@/features/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui";
import { ChevronsUpDown, ChevronUp, Globe, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { SIDEBAR_GROUPS } from "./constants";
import { GroupSection } from "./group";

export function AppSidebar() {
  const { data } = useDomains();
  const { authUser, updateUser, logout } = useAuthUser();
  const currentDomain = data?.find((i) => i.id === authUser?.domainId);
  const router = useRouter();

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
        <SidebarHeader className="h-16 items-center justify-center border-b">
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
                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                  {data?.map((domain) => (
                    <DropdownMenuItem
                      key={domain.id}
                      disabled={domain.id === currentDomain?.id}
                      onClick={() => onDomainSwitch(domain)}
                    >
                      <span>{domain.key}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="gap-1 my-4">
          <GroupSection group={SIDEBAR_GROUPS.class} />
          <GroupSection group={SIDEBAR_GROUPS.twin} />
          <GroupSection group={SIDEBAR_GROUPS.user} />
          <GroupSection group={SIDEBAR_GROUPS.datalist} />
          <GroupSection group={SIDEBAR_GROUPS.permission} />
          <GroupSection group={SIDEBAR_GROUPS.factory} />
          <GroupSection group={SIDEBAR_GROUPS.transition} />
          <GroupSection group={SIDEBAR_GROUPS.businessAccount} />
          <GroupSection group={SIDEBAR_GROUPS.misc} />
        </SidebarContent>

        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
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
