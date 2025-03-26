"use client";

import { useContext, useEffect } from "react";

import { TwinClassContext } from "@/entities/twin-class";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinStatusContext } from "@/features/twin-status";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinStatusGeneral } from "./twin-status-general";

export default function TwinClassPage() {
  const { twinClass } = useContext(TwinClassContext);
  const { twinStatus, twinStatusId } = useContext(TwinStatusContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: `/${PlatformArea.core}/twinclass` },
      {
        label: twinClass.name ?? "N/A",
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}`,
      },
      {
        label: "Statuses",
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}#statuses`,
      },
      {
        label: twinStatus?.name ?? "N/A",
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}/twinStatus/${twinStatusId}`,
      },
    ]);
  }, [twinClass.id, twinClass.name, twinStatus?.name, twinStatusId]);

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
