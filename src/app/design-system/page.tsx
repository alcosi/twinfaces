"use client";

import { Tab, TabsLayout } from "@/widgets/layout";
import { InputFieldsTab } from "./tabs/input-fields";
import { ResourceLinksTab } from "./tabs/resource-links";

const tabs: Tab[] = [
  {
    key: "resource-links",
    label: "Resource Links",
    content: <ResourceLinksTab />,
  },
  {
    key: "input-fields",
    label: "Input Fields",
    content: <InputFieldsTab />,
  },
];

export default function DesignSystemPage() {
  return <TabsLayout tabs={tabs} />;
}
