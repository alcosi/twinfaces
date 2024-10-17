"use client";

import { Section, SideNavLayout } from "@/components/layout/side-nav-layout";
import { TwinGeneral } from "@/app/twin/[twinId]/twin-general";
import { TwinLinks } from "@/app/twin/[twinId]/twin-links";

export default function TwinPage() {
  const sections: Section[] = [
    {
      key: "general",
      label: "General",
      content: <TwinGeneral />,
    },
    {
      key: "links",
      label: "Links",
      content: <TwinLinks />,
    },
  ];

  return <SideNavLayout sections={sections} />;
}
