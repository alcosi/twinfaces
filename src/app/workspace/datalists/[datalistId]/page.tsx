"use client";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { DatalistContext } from "@/features/datalist";
import { Tab, TabsLayout } from "@/widgets/layout";
import { DatalistOptionsTable } from "@/widgets/tables";
import { useContext, useEffect } from "react";
import { DatalistGeneral } from "./views";

//TODO: implement <DatalistScreen />
export default function DatalistPage() {
  const { datalistId, datalist } = useContext(DatalistContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Datalists", href: "/workspace/datalists" },
      {
        label: datalist?.name!,
        href: `/workspace/datalists/${datalistId}`,
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
      content: <DatalistOptionsTable dataListId={datalistId} />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
