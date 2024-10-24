"use client";

import { TwinClassFields } from "@/app/twinclass/[twinClassId]/twin-class-fields";
import { TwinClassGeneral } from "@/app/twinclass/[twinClassId]/twin-class-general";
import { TwinClassStatuses } from "@/app/twinclass/[twinClassId]/twin-class-statuses";
import { TwinClassTwinflows } from "@/app/twinclass/[twinClassId]/twin-class-twinflows";
import { Section, SideNavLayout } from "@/components/layout/side-nav-layout";
import { TwinClassLinks } from "@/pages/twinClassLinks";

export default function TwinClassPage() {
  const sections: Section[] = [
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

  return <SideNavLayout sections={sections} />;
}
