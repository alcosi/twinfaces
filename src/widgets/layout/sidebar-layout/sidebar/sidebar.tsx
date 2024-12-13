"use client";

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
import { SIDEBAR_GROUPS } from "./constants";
import { GroupSection } from "./group";
import Link from "next/link";

export function AppSidebar() {
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
                    alcosi
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem>
                    <span>basic</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>elpmi</span>
                  </DropdownMenuItem>
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
                    <Link href="/" className="block">
                      Sign out
                    </Link>
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
