import React from "react";

import { PublicLayoutProviders } from "@/widgets/layout";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PublicLayoutProviders>{children}</PublicLayoutProviders>;
}
