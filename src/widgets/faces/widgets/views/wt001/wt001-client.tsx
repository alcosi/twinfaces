"use client";

import { TwinsTable } from "../../../../tables";

export function WT001Client({
  title,
  baseTwinClassId,
  enabledColumns,
  searchId,
}: {
  title?: string;
  baseTwinClassId?: string;
  enabledColumns?: string[];
  searchId?: string;
}) {
  return (
    <TwinsTable
      title={title}
      baseTwinClassId={baseTwinClassId}
      enabledColumns={enabledColumns}
      searchId={searchId}
    />
  );
}
