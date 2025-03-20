"use client";

import { TwinsTable } from "../../tables";

export function WT001Client({
  title,
  baseTwinClassId,
}: {
  title?: string;
  baseTwinClassId?: string;
}) {
  return <TwinsTable title={title} baseTwinClassId={baseTwinClassId} />;
}
