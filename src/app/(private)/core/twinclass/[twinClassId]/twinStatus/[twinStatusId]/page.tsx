"use client";

import { useContext } from "react";

import { TwinStatusContext } from "@/features/twin-status";
import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinStatusGeneral } from "./twin-status-general";

export default function TwinClassPage() {
  const { twinStatus } = useContext(TwinStatusContext);

  const tabs: Tab[] = twinStatus
    ? [
        {
          key: "general",
          label: "General",
          content: <TwinStatusGeneral />,
        },
      ]
    : [];

  return <TabsLayout tabs={tabs} />;
}
