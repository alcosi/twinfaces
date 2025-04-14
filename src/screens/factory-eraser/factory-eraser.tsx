"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { FactoryEraserContext } from "@/features/factory-eraser";
import { PlatformArea } from "@/shared/config";
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
  const { eraserId, eraser } = useContext(FactoryEraserContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Erasers",
        href: `/${PlatformArea.core}/erasers`,
      },
      {
        label: eraser.factory.name || eraser.factory.key!,
        href: `/${PlatformArea.core}/erasers/${eraserId}`,
      },
    ]);
  }, [eraserId, eraser.factory.name, eraser.factory.key, setBreadcrumbs]);

  return <TabsLayout tabs={tabs} />;
}
