import { PropsWithChildren } from "react";

import { fetchSidebarFace } from "@/entities/face";
import { SidebarProvider } from "@/shared/ui";

import { SidebarLayoutContent } from "./content";
import { SidebarLayoutHeader } from "./header";
import { AppSidebar } from "./sidebar";

type Props = PropsWithChildren<{}>;

export async function SidebarLayout({ children }: Props) {
  const face = await fetchSidebarFace();

  return (
    <SidebarProvider>
      <AppSidebar face={face} />
      <div className="w-full">
        <SidebarLayoutHeader />
        <SidebarLayoutContent>{children}</SidebarLayoutContent>
      </div>
    </SidebarProvider>
  );
}
