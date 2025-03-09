import React from "react";

import { ApiContextProvider } from "@/features/api-context-provider";

export default function DesignSystemLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ApiContextProvider>{children}</ApiContextProvider>;
}
