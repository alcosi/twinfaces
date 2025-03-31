import { PropsWithChildren } from "react";

import { fetchSidebarFace } from "@/entities/face";
import { RenderOnClient, SidebarProvider } from "@/shared/ui";

import { SidebarLayoutContent } from "./content";
import { SidebarLayoutHeader } from "./header";
import { AppSidebar } from "./sidebar";

type Props = PropsWithChildren<{}>;

export async function SidebarLayout({ children }: Props) {
  const face = await fetchSidebarFace();

  return (
    <SidebarProvider>
      <RenderOnClient>
        <AppSidebar face={face} />
        <div className="w-full">
          <SidebarLayoutHeader />
          <SidebarLayoutContent>{children}</SidebarLayoutContent>
        </div>
      </RenderOnClient>
    </SidebarProvider>
  );
}
