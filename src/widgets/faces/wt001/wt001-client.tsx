"use client";

import { TwinsTable } from "../../tables";

export function WT001Client({
  title,
  baseTwinClassId,
  enabledColumns,
}: {
  title?: string;
  baseTwinClassId?: string;
  enabledColumns?: string[];
}) {
  return (
    <TwinsTable
      title={title}
      baseTwinClassId={baseTwinClassId}
      enabledColumns={enabledColumns}
    />
  );
}
