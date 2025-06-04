"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { ProductsScreen } from "./components/product-screen";
import { ActionDialogsTab } from "./tabs/action-dialogs";
import { EditorsTab } from "./tabs/editors";
import { IconsTab } from "./tabs/icons";
import { InputFieldsTab } from "./tabs/input-fields";
import { ResourceLinksTab } from "./tabs/resource-links";
import { TablesTab } from "./tabs/tables";

export default function DesignSystemPage() {
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
    {
      key: "editors",
      label: "Editors",
      content: <EditorsTab />,
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="p-4 text-xl font-medium">Design system</h1>
      <div>
        <TabsLayout tabs={tabs} />
      </div>
    </div>
  );
}
