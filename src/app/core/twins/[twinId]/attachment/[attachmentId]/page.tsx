"use client";

import { useContext, useEffect } from "react";

import { AttachmentContext } from "@/features/attachment";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinContext } from "@/features/twin";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";

import { AttachmentGeneral } from "./attachment-general";

export default function AttachmentPage() {
  const { twin } = useContext(TwinContext);
  const { attachment } = useContext(AttachmentContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Twins", href: `/${PlatformArea.core}/twins` },
      {
        label: twin?.name,
        href: `/${PlatformArea.core}/twins/${twin.id}`,
      },
      {
        label: "Attachments",
        href: `/${PlatformArea.core}/twins/${twin.id}/#attachments`,
      },
    ]);
  }, [setBreadcrumbs, twin.id, twin.name]);

  const tabs: Tab[] = attachment
    ? [
        {
          key: "general",
          label: "General",
          content: <AttachmentGeneral />,
        },
      ]
    : [];

  return <TabsLayout tabs={tabs} />;
}
