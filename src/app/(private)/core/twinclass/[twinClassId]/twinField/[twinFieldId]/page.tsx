"use client";

import { useContext } from "react";

import { TwinFieldContext } from "@/features/twin-class-field";
import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinFieldGeneral } from "./twin-field-general";

export default function TwinClassPage() {
  const { twinField } = useContext(TwinFieldContext);

  const tabs: Tab[] = twinField
    ? [
        {
          key: "general",
          label: "General",
          content: <TwinFieldGeneral />,
        },
      ]
    : [];

  return <TabsLayout tabs={tabs} />;
}
