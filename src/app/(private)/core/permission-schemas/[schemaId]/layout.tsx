"use client";

import React from "react";

import { PermissionSchemaContextProvider } from "@/features/permission-schema";

interface PermissionSchemaLayoutProps {
  params: {
    schemaId: string;
  };
  children: React.ReactNode;
}

export default function DatalistLayout({
  params: { schemaId },
  children,
}: PermissionSchemaLayoutProps) {
  return (
    <PermissionSchemaContextProvider schemaId={schemaId}>
      {children}
    </PermissionSchemaContextProvider>
  );
}
