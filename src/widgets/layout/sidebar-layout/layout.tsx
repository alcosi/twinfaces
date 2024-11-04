import { SidebarProvider, SidebarTrigger } from "@/components/base/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import React from "react";
import { AppSidebar } from "./sidebar";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <header className="sticky top-0 z-10 flex justify-between items-center h-16 px-4 md:px-6 border-b bg-background">
          <SidebarTrigger />
          <ThemeToggle />
        </header>
        <main className="border border-transparent rounded-lg p-4 m-4">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
