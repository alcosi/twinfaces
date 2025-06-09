import React from "react";

import { PrivateLayoutProviders } from "@/widgets/layout";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PrivateLayoutProviders>{children}</PrivateLayoutProviders>;
}
