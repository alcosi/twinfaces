"use client";

import { ReactNode } from "react";

import { useIsClient } from "../libs";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

export function RenderOnClient({ children, fallback = null }: Props) {
  const isClient = useIsClient();

  return isClient ? <>{children}</> : <>{fallback}</>;
}
