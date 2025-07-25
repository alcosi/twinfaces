import React from "react";
import { Toaster } from "sonner";

import { PrivateApiContextProvider } from "@/features/api";
import { QuickViewProvider } from "@/features/quick-view-overlay";
import { TooltipProvider } from "@/shared/ui";

import { SidebarLayout } from "../sidebar-layout";

export function PrivateLayoutProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateApiContextProvider>
      <QuickViewProvider>
        <TooltipProvider delayDuration={700} skipDelayDuration={0}>
          <SidebarLayout>{children}</SidebarLayout>
          <Toaster />
        </TooltipProvider>
      </QuickViewProvider>
    </PrivateApiContextProvider>
  );
}
