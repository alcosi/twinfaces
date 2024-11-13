import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  useSidebar,
} from "@/components/base/sidebar";
import { PropsWithChildren } from "react";

export function SidebarLayoutContent({ children }: PropsWithChildren<{}>) {
  const { state } = useSidebar();

  const sidebarWidth =
    state === "expanded" ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON;

  return (
    <main
      className="border border-transparent rounded-lg px-8 overflow-y-auto overflow-x-hidden"
      style={{
        maxHeight: "calc(100vh - var(--header-height))",
        maxWidth: `calc(100vw - ${sidebarWidth})`,
      }}
    >
      {children}
    </main>
  );
}
