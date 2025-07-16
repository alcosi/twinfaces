"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { GeneralSection } from "./views/general-section";

export function TwinClassLinkPage() {
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <GeneralSection />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
