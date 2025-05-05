"use client";

import { useContext, useEffect } from "react";

import { AttachmentContext } from "@/features/attachment";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";

import { AttachmentGeneral } from "./views";

export function AttachmentScreen() {
  const { attachment } = useContext(AttachmentContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Attachments",
        href: `/${PlatformArea.core}/attachments`,
      },
    ]);
  }, [setBreadcrumbs, attachment]);

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
