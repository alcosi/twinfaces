"use client";

import { useContext, useEffect } from "react";

import { TwinClassContext } from "@/entities/twin-class";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinFlowContext } from "@/features/twin-flow";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";
import { TwinFlowTransitionsTable } from "@/widgets/tables";

import { TwinflowGeneral } from "./twinflow-general";

export default function TwinflowPage() {
  const { twinClass } = useContext(TwinClassContext);
  const { twinFlow } = useContext(TwinFlowContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: `/${PlatformArea.core}/twinclass` },
      {
        label: twinClass?.name!,
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}`,
      },
      {
        label: "Twinflows",
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}#twinflows`,
      },
      {
        label: twinFlow?.name ?? "N/A",
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}/twinflow/${twinFlow.id}`,
      },
    ]);
  }, [twinClass?.id, twinClass?.name, twinFlow?.id, twinFlow?.name]);

  const tabs: Tab[] = twinFlow
    ? [
        {
          key: "general",
          label: "General",
          content: <TwinflowGeneral />,
        },
        {
          key: "transitions",
          label: "Transitions",
          content: <TwinFlowTransitionsTable twinflow={twinFlow} />,
        },
      ]
    : [];

  return <TabsLayout tabs={tabs} />;
}
