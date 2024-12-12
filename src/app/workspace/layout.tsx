import { ApiContextProvider } from "@/features/api-context-provider";
import { BreadcrumbProvider } from "@/features/breadcrumb";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { SidebarLayout } from "@/widgets";
import React from "react";
import { Toaster } from "sonner";

export default function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ApiContextProvider>
      <BreadcrumbProvider>
        <SidebarLayout>
          <TooltipProvider delayDuration={700} skipDelayDuration={0}>
            {children}
          </TooltipProvider>
        </SidebarLayout>
      </BreadcrumbProvider>
      <Toaster />
    </ApiContextProvider>
  );
}
