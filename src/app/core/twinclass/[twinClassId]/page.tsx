"use client";

import { useContext } from "react";

import { TwinClassContext } from "@/entities/twin-class";
import { TwinClassRelations } from "@/screens/twin-class-relations";
import { Tab, TabsLayout } from "@/widgets/layout";
import {
  TwinClassFieldsTable,
  TwinClassStatusesTable,
  TwinFlows,
} from "@/widgets/tables";

import { TwinClassGeneral } from "./views";

export default function TwinClassPage() {
  const { twinClassId } = useContext(TwinClassContext);

  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <TwinClassGeneral />,
    },
    {
      key: "fields",
      label: "Fields",
      content: <TwinClassFieldsTable twinClassId={twinClassId} />,
    },
    {
      key: "statuses",
      label: "Statuses",
      content: <TwinClassStatusesTable twinClassId={twinClassId} />,
    },
    {
      key: "twinflows",
      label: "Twinflows",
      content: <TwinFlows twinClassId={twinClassId} />,
    },
    {
      key: "relations",
      label: "Relations",
      content: <TwinClassRelations />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
