"use client";

import { TwinClassFields } from "@/app/twinclass/[twinClassId]/twin-class-fields";
import { TwinClassGeneral } from "@/app/twinclass/[twinClassId]/twin-class-general";
import { TwinClassStatuses } from "@/app/twinclass/[twinClassId]/twin-class-statuses";
import { TwinClassTwinflows } from "@/app/twinclass/[twinClassId]/twin-class-twinflows";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinClassLinks } from "@/pages/twinClassLinks";
import { Tab, TabsLayout } from "@/widgets";
import { useEffect } from "react";

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

  useEffect(() => {
    setBreadcrumbs([{ label: "Twin Classes", href: "/twinclass" }]);
  }, [setBreadcrumbs]);

  return <TabsLayout tabs={tabs} />;
}
