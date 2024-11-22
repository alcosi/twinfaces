"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";
import { cn } from "@/shared/libs";
import {
  BookKey,
  Braces,
  Key,
  LayoutTemplate,
  Smile,
  ListTree,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Classes",
    url: "/twinclass",
    icon: LayoutTemplate,
  },
  {
    title: "Twins",
    url: "/twin",
    icon: Braces,
  },
  {
    title: "Permissions",
    url: "/permission",
    icon: Key,
  },
  {
    title: "Permission Groups",
    url: "/permission-group",
    icon: BookKey,
  },
  {
    title: "Datalists",
    url: "/datalists",
    icon: ListTree,
  },
];

export function AppSidebar() {
  const pathname = usePathname() || "";

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

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Entities</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const isActive = new RegExp(`^${item.url}(/|$)`).test(
                    pathname
                  );

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={cn(
                            "flex items-center gap-2",
                            isActive && "text-primary font-bold"
                          )}
                        >
                          <item.icon
                            className={cn(isActive && "stroke-[3px]")}
                          />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </nav>
  );
}
