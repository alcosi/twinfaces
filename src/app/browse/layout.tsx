import { ReactNode } from "react";

import { PrivateLayoutProviders } from "@/widgets/layout";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <PrivateLayoutProviders>{children}</PrivateLayoutProviders>;
}
