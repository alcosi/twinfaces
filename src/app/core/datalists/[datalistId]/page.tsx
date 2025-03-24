"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { DatalistContext } from "@/features/datalist";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";
import { DatalistOptionsTable } from "@/widgets/tables";

import { DatalistGeneral } from "./views";

//TODO: implement <DatalistScreen />
export default function DatalistPage() {
  const { datalistId, datalist } = useContext(DatalistContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Datalists", href: `/${PlatformArea.core}/datalists` },
      {
        label: datalist?.name!,
        href: `/${PlatformArea.core}/datalists/${datalistId}`,
      },
    ]);
  }, [datalistId, datalist?.name, setBreadcrumbs]);

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
