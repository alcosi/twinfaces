import React from "react";

import { PublicApiContextProvider } from "@/features/api";

export function PublicLayoutProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicApiContextProvider>{children}</PublicApiContextProvider>;
}
