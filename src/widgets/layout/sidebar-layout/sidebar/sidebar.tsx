"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui";
import { Smile } from "lucide-react";
import Link from "next/link";
import { SIDEBAR_GROUPS } from "./constants";
import { GroupSection } from "./group";

export function AppSidebar() {
  return (
    <nav>
      <Sidebar collapsible="icon">
        <SidebarHeader className="h-16 items-center justify-center">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xl font-semibold md:text-lg"
                >
                  <Smile className="h-6 w-6 text-primary" />
                  Twin Faces
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="gap-1">
          <GroupSection group={SIDEBAR_GROUPS.class} />
          <GroupSection group={SIDEBAR_GROUPS.twin} />
          <GroupSection group={SIDEBAR_GROUPS.flow} />
          <GroupSection group={SIDEBAR_GROUPS.user} />
          <GroupSection group={SIDEBAR_GROUPS.permission} />
          <GroupSection group={SIDEBAR_GROUPS.misc} />
        </SidebarContent>
      </Sidebar>
    </nav>
  );
}
