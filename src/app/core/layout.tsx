import React from "react";

// import { getFullAuthUser } from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { requirePermissionsOr404 } from "@/entities/user/server";
import { PrivateLayoutProviders } from "@/widgets/layout";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requirePermissionsOr404([KEY_TO_ID_PERMISSION_MAP.DOMAIN_MANAGE]);

  // const authUser = await getFullAuthUser();

  // if (!authUser) {
  //   return null;
  // }

  return <PrivateLayoutProviders>{children}</PrivateLayoutProviders>;
}
