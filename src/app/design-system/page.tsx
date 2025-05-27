"use client";

import { useState } from "react";

import { HTMLEditor, HTMLPreview } from "@/features/editors";
import { ThemeToggle } from "@/features/ui/theme-toggle";
import { Button } from "@/shared/ui";
import { Tab, TabsLayout } from "@/widgets/layout";

import { ProductsScreen } from "./components/product-screen";
import { MOCK_HTML } from "./seeds";
import { ActionDialogsTab } from "./tabs/action-dialogs";
import { IconsTab } from "./tabs/icons";
import { InputFieldsTab } from "./tabs/input-fields";
import { ResourceLinksTab } from "./tabs/resource-links";
import { TablesTab } from "./tabs/tables";

export default function DesignSystemPage() {
  const [showEditor, setShowEditor] = useState(false);

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
      key: "html-preview",
      label: "HTML Preview",
      content: (
        <div className="w-full">
          <HTMLPreview source={MOCK_HTML} />
          <Button
            className="h-20 w-35"
            variant="secondary"
            onClick={() => setShowEditor((prev) => !prev)}
          >
            Show HTMLEditor
          </Button>
          {showEditor && (
            <div className="mt-4 border-t pt-4">
              <HTMLEditor initialHTML={MOCK_HTML} />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between p-4 pb-0">
        <h1 className="text-xl font-medium">Design system</h1>
        <ThemeToggle />
      </div>
      <div>
        <TabsLayout tabs={tabs} />
      </div>
    </div>
  );
}
