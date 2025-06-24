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
      className={`md:max-w-[calc(100vw - ${sidebarWidth})] max-w-['100vw'] overflow-x-hidden overflow-y-auto rounded-lg border border-transparent px-8`}
      style={{
        maxHeight: "calc(100vh - var(--header-height))",
      }}
    >
      {children}
    </main>
  );
}
