"use client";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinClassLinks } from "@/screens/twinClassLinks";
import { Tab, TabsLayout } from "@/widgets";
import { useContext, useEffect } from "react";
import { TwinClassContext } from "./twin-class-context";
import {
  TwinClassFields,
  TwinClassGeneral,
  TwinClassStatuses,
  TwinClassTwinflows,
} from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <TwinClassGeneral />,
  },
  {
    key: "fields",
    label: "Fields",
    content: <TwinClassFields />,
  },
  {
    key: "statuses",
    label: "Statuses",
    content: <TwinClassStatuses />,
  },
  {
    key: "twinflows",
    label: "Twinflows",
    content: <TwinClassTwinflows />,
  },
  {
    key: "links",
    label: "Links",
    content: <TwinClassLinks />,
  },
];

export default function TwinClassPage() {
  const { setBreadcrumbs } = useBreadcrumbs();
  const { twinClass } = useContext(TwinClassContext);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: `/twinclass` },
      { label: twinClass?.name!, href: `/twinclass/${twinClass?.id}` },
    ]);
  }, [twinClass?.id, twinClass?.name]);

  return <TabsLayout tabs={tabs} />;
}
