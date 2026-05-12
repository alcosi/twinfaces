import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinStatusGeneral, TwinStatusTriggers } from "./views";

export function StatusScreen() {
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <TwinStatusGeneral />,
    },
    {
      key: "triggers",
      label: "Triggers",
      content: <TwinStatusTriggers />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
