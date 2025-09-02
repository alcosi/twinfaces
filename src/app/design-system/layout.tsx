import React from "react";

import { UrlBreadcrumbHeader } from "@/features/ui/headers";
import { PrivateLayoutProviders } from "@/widgets/layout";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <PrivateLayoutProviders>
      <>
        <UrlBreadcrumbHeader />
        {children}
      </>
    </PrivateLayoutProviders>
  );
}
