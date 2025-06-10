import React from "react";

import { getAuthHeaders } from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { isGranted } from "@/entities/user/server";
import { PermissionDeniedScreen } from "@/screens/permission-denied";
import { PrivateLayoutProviders } from "@/widgets/layout";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { currentUserId } = await getAuthHeaders();
  const isAdmin = await isGranted({
    userId: currentUserId,
    permission: KEY_TO_ID_PERMISSION_MAP.DOMAIN_MANAGE,
  });

  if (!isAdmin) {
    return <PermissionDeniedScreen />;
  }

  return <PrivateLayoutProviders>{children}</PrivateLayoutProviders>;
}
