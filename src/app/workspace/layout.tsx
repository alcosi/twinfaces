import { BreadcrumbProvider } from "@/features/breadcrumb";
import { SidebarLayout } from "@/widgets";
import React from "react";
import { Toaster } from "sonner";

export default function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <BreadcrumbProvider>
      <SidebarLayout>{children}</SidebarLayout>
      <Toaster />
    </BreadcrumbProvider>
  );
}
