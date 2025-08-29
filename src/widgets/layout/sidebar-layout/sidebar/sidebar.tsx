"use client";

import { cn } from "@/shared/libs";
import {
  HelpIcon,
  SettingsIcon,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/shared/ui";

import { WorkspaceAreaSidebarMenu } from "./menu";
import { CollapsedFooterMenu } from "./menu/collapsed-menu";
import { MenuItem } from "./menu/menu-item";

const SIDEBAR_FOOTER_ITEMS = [
  {
    key: "help",
    label: "Help",
    icon: HelpIcon,
    url: "/help",
  },
  { key: "settings", label: "Settings", icon: SettingsIcon, url: "/settings" },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <nav className="group relative">
      <Sidebar collapsible="icon">
        <SidebarTrigger
          className={cn(
            "border-border bg-ons-brand-50 absolute top-1 -right-4 z-20 border shadow-sm",
            "opacity-0 transition-opacity group-hover:opacity-100"
          )}
        />

        <SidebarContent>
          <WorkspaceAreaSidebarMenu />
        </SidebarContent>

        <SidebarFooter className={cn(!open && "mb-[14.9px] items-center")}>
          {open ? (
            <SidebarMenu className="mb-3 flex gap-0">
              {SIDEBAR_FOOTER_ITEMS.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton className="px-[10px] py-6">
                    <MenuItem
                      label={item.label}
                      url={item.url}
                      Icon={item.icon}
                    />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          ) : (
            <CollapsedFooterMenu
              items={SIDEBAR_FOOTER_ITEMS}
              getItemProps={(item) => ({
                key: item.key,
                label: item.label,
                url: item.url,
                Icon: item.icon,
                hidden: false,
                className: "flex items-center justify-center h-10 w-full",
                buttonClassName: "flex items-center justify-center",
              })}
            />
          )}
        </SidebarFooter>
      </Sidebar>
    </nav>
  );
}
