"use client";

import { Section, SideNavLayout } from "@/components/layout/side-nav-layout";
import { TwinGeneral } from "@/app/twin/[twinId]/twin-general";
import { TwinLinks } from "@/app/twin/[twinId]/twin-links";
import { TwinFields } from "@/app/twin/[twinId]/twin-fields";
import { TwinComments } from "@/app/twin/[twinId]/twin-comments ";

export default function TwinPage() {
  const sections: Section[] = [
    {
      key: "general",
      label: "General",
      content: <TwinGeneral />,
    },
    {
      key: "fields",
      label: "Fields",
      content: <TwinFields />,
    },
    {
      key: "links",
      label: "Links",
      content: <TwinLinks />,
    },
    {
      key: "comments",
      label: "Comments",
      content: <TwinComments />,
    },
  ];

  return <SideNavLayout sections={sections} />;
}
