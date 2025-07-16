"use client";

import { useContext } from "react";

import { AttachmentContext } from "@/features/attachment";
import { Tab, TabsLayout } from "@/widgets/layout";

import { AttachmentGeneral } from "./views";

export function AttachmentScreen() {
  const { attachment } = useContext(AttachmentContext);

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
