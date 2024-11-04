"use client";

import { TwinFields } from "@/app/twin/[twinId]/twin-fields";
import { TwinGeneral } from "@/app/twin/[twinId]/twin-general";
import { TwinLinks } from "@/app/twin/[twinId]/twin-links";
import { Tab, TabsLayout } from "@/widgets";

export default function TwinPage() {
  const tabs: Tab[] = [
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
  ];

  return <TabsLayout tabs={tabs} />;
}
