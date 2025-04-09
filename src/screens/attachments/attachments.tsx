"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { TwinAttachmentsTable } from "@/widgets/tables";

export function AttachmentsScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Attachments", href: `/${PlatformArea.core}/attachments` },
    ]);
  }, [setBreadcrumbs]);

  return <TwinAttachmentsTable />;
}
