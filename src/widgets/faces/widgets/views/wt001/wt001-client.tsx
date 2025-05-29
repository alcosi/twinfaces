"use client";

import { FaceWT001 } from "@/entities/face";

import { TwinsTable } from "../../../../tables";

export function WT001Client({
  title,
  baseTwinClassId,
  enabledColumns,
  showCreateButton,
  isAdmin,
}: {
  title?: string;
  baseTwinClassId?: string;
  enabledColumns?: FaceWT001["columns"];
  showCreateButton?: boolean;
  isAdmin: boolean;
}) {
  return (
    <TwinsTable
      title={title}
      baseTwinClassId={baseTwinClassId}
      enabledColumns={enabledColumns}
      showCreateButton={showCreateButton}
      resourceNavigationEnabled={isAdmin}
    />
  );
}
