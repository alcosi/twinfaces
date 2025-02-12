"use client";

import {
  PermissionContextProvider,
  PermissionLayoutProps,
} from "@/features/permission";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

export default function PermissionLayout({ children }: PropsWithChildren) {
  const params = useParams<PermissionLayoutProps["params"]>();

  return params ? (
    <PermissionContextProvider params={params}>
      {children}
    </PermissionContextProvider>
  ) : null;
}
