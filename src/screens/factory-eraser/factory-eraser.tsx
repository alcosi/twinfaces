"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryEraserGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryEraserGeneral />,
  },
];

export function FactoryEraserScreen() {
  return <TabsLayout tabs={tabs} />;
}
