"use client";

import { ThemeToggle } from "@/features/ui/theme-toggle";
import { Tab, TabsLayout } from "@/widgets/layout";

import { ProductsScreen } from "./components/product-screen";
import { ActionDialogsTab } from "./tabs/action-dialogs";
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
    key: "action-dialogs",
    label: "Action dialogs",
    content: <ActionDialogsTab />,
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
    label: "Product View",
    content: <ProductsScreen />,
  },
];

export default function DesignSystemPage() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row p-4 pb-0 justify-between">
        <h1 className="text-xl font-medium">Design system</h1>
        <ThemeToggle />
      </div>
      <div>
        <TabsLayout tabs={tabs} />
      </div>
    </div>
  );
}
