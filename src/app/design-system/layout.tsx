import { ApiContextProvider } from "@/features/api-context-provider";
import React from "react";

export default function DesignSystemLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ApiContextProvider>{children}</ApiContextProvider>;
}
