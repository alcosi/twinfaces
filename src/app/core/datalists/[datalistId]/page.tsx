"use client";

import { useContext } from "react";

import { DatalistContext } from "@/features/datalist";
import { Tab, TabsLayout } from "@/widgets/layout";
import { DatalistOptionsTable } from "@/widgets/tables";

import { DatalistGeneral } from "./views";

//TODO: implement <DatalistScreen />
export default function DatalistPage() {
  const { datalist } = useContext(DatalistContext);

  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <DatalistGeneral />,
    },
    {
      key: "options",
      label: "Options",
      content: <DatalistOptionsTable datalist={datalist} />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
