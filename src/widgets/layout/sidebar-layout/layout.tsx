"use client";

import { SidebarProvider } from "@/components/base/sidebar";
import React from "react";
import { SidebarLayoutContent } from "./content";
import { SidebarLayoutHeader } from "./header";
import { AppSidebar } from "./sidebar";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <SidebarLayoutHeader />
        <SidebarLayoutContent>{children}</SidebarLayoutContent>
      </div>
    </SidebarProvider>
  );
}
