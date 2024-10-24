"use client";

import { TwinGeneral } from "@/app/twin/[twinId]/twin-general";
import { TwinLinks } from "@/app/twin/[twinId]/twin-links";
import { Section, SideNavLayout } from "@/widgets/layouts";

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
