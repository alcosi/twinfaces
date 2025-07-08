"use client";

import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

import {
  PermissionContextProvider,
  PermissionLayoutProps,
} from "@/features/permission";

export default function PermissionLayout({ children }: PropsWithChildren) {
  const params = useParams<PermissionLayoutProps["params"]>();

  return params ? (
    <PermissionContextProvider params={params}>
      {children}
    </PermissionContextProvider>
  ) : null;
}
