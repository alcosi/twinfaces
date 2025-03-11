import React from "react";
import { Toaster } from "sonner";

import { PrivateApiContextProvider } from "@/features/api";
import { BreadcrumbProvider } from "@/features/breadcrumb";
import { QuickViewProvider } from "@/features/quick-view-overlay";
import { SidebarLayout } from "@/widgets/layout";

export default function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <PrivateApiContextProvider>
      <BreadcrumbProvider>
        <QuickViewProvider>
          <SidebarLayout>{children}</SidebarLayout>
          <Toaster />
        </QuickViewProvider>
      </BreadcrumbProvider>
    </PrivateApiContextProvider>
  );
}
