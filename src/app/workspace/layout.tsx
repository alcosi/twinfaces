import { ApiContextProvider } from "@/features/api-context-provider";
import { BreadcrumbProvider } from "@/features/breadcrumb";
import { QuickViewProvider } from "@/features/quick-view-overlay";
import { SidebarLayout } from "@/widgets/layout";
import React from "react";
import { Toaster } from "sonner";

export default function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ApiContextProvider>
      <BreadcrumbProvider>
        <QuickViewProvider>
          <SidebarLayout>{children}</SidebarLayout>
          <Toaster />
        </QuickViewProvider>
      </BreadcrumbProvider>
    </ApiContextProvider>
  );
}
