import React from "react";

import { PrivateApiContextProvider } from "@/features/api";

export default function DesignSystemLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PrivateApiContextProvider>{children}</PrivateApiContextProvider>;
}
