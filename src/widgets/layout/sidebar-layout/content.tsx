"use client";

import { PropsWithChildren } from "react";

import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  useSidebar,
} from "@/shared/ui/sidebar";

export function SidebarLayoutContent({ children }: PropsWithChildren<{}>) {
  const { state } = useSidebar();

  const sidebarWidth =
    state === "expanded" ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON;

  return (
    <main
      className="overflow-y-auto overflow-x-hidden rounded-lg border border-transparent px-8"
      style={{
        maxHeight: "calc(100vh - var(--header-height))",
        maxWidth: `calc(100vw - ${sidebarWidth})`,
      }}
    >
      {children}
    </main>
  );
}
