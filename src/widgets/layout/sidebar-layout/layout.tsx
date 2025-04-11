import { PropsWithChildren } from "react";

import { fetchSidebarFace } from "@/entities/face";
import { safe } from "@/shared/libs";
import { RenderOnClient, SidebarProvider } from "@/shared/ui";

import { SidebarLayoutContent } from "./content";
import { SidebarLayoutHeader } from "./header";
import { AppSidebar } from "./sidebar";

type Props = PropsWithChildren<{}>;

export async function SidebarLayout({ children }: Props) {
  const result = await safe(fetchSidebarFace);
  const face = result.ok ? result.data : undefined;

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
