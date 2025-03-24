"use client";

import { useContext, useEffect } from "react";

import { TwinClassContext } from "@/entities/twin-class";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinClassRelations } from "@/screens/twin-class-relations";
import { TwinClassTwinFlows } from "@/screens/twinClassTwinFlows";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";
import { TwinClassFieldsTable, TwinClassStatusesTable } from "@/widgets/tables";

import { TwinClassGeneral } from "./views";

export default function TwinClassPage() {
  const { setBreadcrumbs } = useBreadcrumbs();
  const { twinClassId, twinClass } = useContext(TwinClassContext);

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
      content: <TwinClassTwinFlows />,
    },
    {
      key: "relations",
      label: "Relations",
      content: <TwinClassRelations />,
    },
  ];

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: `/${PlatformArea.core}/twinclass` },
      {
        label: twinClass?.name!,
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}`,
      },
    ]);
  }, [twinClass?.id, twinClass?.name, setBreadcrumbs]);

  return <TabsLayout tabs={tabs} />;
}
