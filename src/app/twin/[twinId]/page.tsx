"use client";

import { TwinFields } from "@/app/twin/[twinId]/twin-fields";
import { TwinGeneral } from "@/app/twin/[twinId]/twin-general";
import { TwinLinks } from "@/app/twin/[twinId]/twin-links";
import { Tab, TabsLayout } from "@/widgets";

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
export default function TwinPage() {
  return <TabsLayout tabs={tabs} />;
}
