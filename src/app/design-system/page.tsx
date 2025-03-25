"use client";

import { Tab, TabsLayout } from "@/widgets/layout";
import { ProductView } from "@/widgets/product-view";

import { IconsTab } from "./tabs/icons";
import { InputFieldsTab } from "./tabs/input-fields";
import { ResourceLinksTab } from "./tabs/resource-links";
import { TablesTab } from "./tabs/tables";

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
  {
    key: "tables",
    label: "Tables",
    content: <TablesTab />,
  },
  {
    key: "icons-fields",
    label: "Icons",
    content: <IconsTab />,
  },
  {
    key: "product-view",
    label: "ProductView",
    content: <ProductView />,
  },
];

export default function DesignSystemPage() {
  return <TabsLayout tabs={tabs} />;
}
