"use client";

import { PropsWithChildren } from "react";

import { useIsMobile } from "@/shared/libs";
import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  useSidebar,
} from "@/shared/ui/sidebar";

export function SidebarLayoutContent({ children }: PropsWithChildren<{}>) {
  const { state } = useSidebar();
  const isMobile = useIsMobile();

  const sidebarWidth =
    state === "expanded" ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON;

  const contentWidth = isMobile ? "100vw" : `calc(100vw - ${sidebarWidth})`;

  return (
    <main
      className="overflow-x-hidden overflow-y-auto rounded-lg border border-transparent px-8"
      style={{
        maxHeight: "calc(100vh - var(--header-height))",
        maxWidth: contentWidth,
      }}
    >
      {children}
    </main>
  );
}
