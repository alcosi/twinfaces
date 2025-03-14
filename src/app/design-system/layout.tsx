import React from "react";

import { PrivateApiContextProvider } from "@/features/api";
import { BreadcrumbProvider } from "@/features/breadcrumb";
import { QuickViewProvider } from "@/features/quick-view-overlay";
import { SidebarLayout } from "@/widgets/layout";

export default function DesignSystemLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <PrivateApiContextProvider>
      <BreadcrumbProvider>
        <QuickViewProvider>
          <SidebarLayout>{children}</SidebarLayout>
        </QuickViewProvider>
      </BreadcrumbProvider>
    </PrivateApiContextProvider>
  );
}
