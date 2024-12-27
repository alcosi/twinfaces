"use client";

import { Tab, TabsLayout } from "@/widgets/layout";
import { DatalistGeneral, DatalistOptions } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <DatalistGeneral />,
  },
  {
    key: "options",
    label: "Options",
    content: <DatalistOptions />,
  },
];

export default function DatalistPage() {
  return <TabsLayout tabs={tabs} />;
}
