import React from "react";
import { Toaster } from "sonner";

import { FaceBC001Item } from "@/entities/face";
import { PrivateApiContextProvider } from "@/features/api";
import { QuickViewProvider } from "@/features/quick-view-overlay";
import { TooltipProvider } from "@/shared/ui";

import { SidebarLayout } from "../sidebar-layout";

type Props = {
  children: React.ReactNode;
  breadcrumbs?: FaceBC001Item[];
  activeTwinId?: string;
};

export function PrivateLayoutProviders({
  children,
  breadcrumbs,
  activeTwinId,
}: Props) {
  return (
    <PrivateApiContextProvider>
      <QuickViewProvider>
        <TooltipProvider delayDuration={700} skipDelayDuration={0}>
          <SidebarLayout breadcrumbs={breadcrumbs} activeTwinId={activeTwinId}>
            {children}
          </SidebarLayout>
          <Toaster />
        </TooltipProvider>
      </QuickViewProvider>
    </PrivateApiContextProvider>
  );
}
