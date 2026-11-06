import React from "react";

import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { requirePermissionsOr404 } from "@/entities/user/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { UrlBreadcrumbHeader } from "@/features/ui/headers";
import { PrivateLayoutProviders } from "@/widgets/layout";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  //? NOTE Redirects to the login flow when the session cookies are missing,
  // instead of crashing the layout with a 500.
  await withRedirectOnUnauthorized(() =>
    requirePermissionsOr404([KEY_TO_ID_PERMISSION_MAP.DOMAIN_MANAGE])
  )();

  return (
    <PrivateLayoutProviders>
      <>
        <UrlBreadcrumbHeader />
        {children}
      </>
    </PrivateLayoutProviders>
  );
}
