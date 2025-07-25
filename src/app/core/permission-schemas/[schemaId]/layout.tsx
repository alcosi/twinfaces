"use client";

import React, { use } from "react";

import { PermissionSchemaContextProvider } from "@/features/permission-schema";

interface PermissionSchemaLayoutProps {
  params: Promise<{
    schemaId: string;
  }>;
  children: React.ReactNode;
}

export default function DatalistLayout(props: PermissionSchemaLayoutProps) {
  const params = use(props.params);

  const { schemaId } = params;

  const { children } = props;

  return (
    <PermissionSchemaContextProvider schemaId={schemaId}>
      {children}
    </PermissionSchemaContextProvider>
  );
}
