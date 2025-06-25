"use client";

import { PropsWithChildren } from "react";

import { useIsMobile } from "@/shared/libs";
import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  useSidebar,
} from "@/shared/ui/sidebar";

const WIDTHS = {
  expanded: SIDEBAR_WIDTH,
  collapsed: SIDEBAR_WIDTH_ICON,
} as const;

export function SidebarLayoutContent({ children }: PropsWithChildren<{}>) {
  const { state } = useSidebar();
  const isMobile = useIsMobile();

  const sidebarWidth = isMobile ? "0px" : WIDTHS[state];

  return (
    <main
      className="overflow-x-hidden overflow-y-auto rounded-lg border border-transparent px-8"
      style={{
        maxHeight: "calc(100vh - var(--header-height))",
        maxWidth: `calc(100vw - ${sidebarWidth})`,
      }}
    >
      {children}
    </main>
  );
}
