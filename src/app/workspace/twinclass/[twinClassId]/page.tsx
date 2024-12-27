"use client";

import { TwinClassContext } from "@/entities/twinClass";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinClassLinks } from "@/screens/twinClassLinks";
import { TwinClassTwinFlows } from "@/screens/twinClassTwinFlows";
import { Tab, TabsLayout } from "@/widgets/layout";
import { TwinClassFieldsTable } from "@/widgets/tables";
import { useContext, useEffect } from "react";
import { TwinClassGeneral, TwinClassStatuses } from "./views";

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
      content: <TwinClassStatuses />,
    },
    {
      key: "twinflows",
      label: "Twinflows",
      content: <TwinClassTwinFlows />,
    },
    {
      key: "links",
      label: "Links",
      content: <TwinClassLinks />,
    },
  ];

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: `/workspace/twinclass` },
      {
        label: twinClass?.name!,
        href: `/workspace/twinclass/${twinClass?.id}`,
      },
    ]);
  }, [twinClass?.id, twinClass?.name, setBreadcrumbs]);

  return <TabsLayout tabs={tabs} />;
}
