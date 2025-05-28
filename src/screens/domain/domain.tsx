import { Tab, TabsLayout } from "@/widgets/layout";

import { DomainGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <DomainGeneral />,
  },
];

export function DomainScreen() {
  return <TabsLayout tabs={tabs} />;
}
