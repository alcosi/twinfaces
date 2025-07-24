import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinStatusGeneral } from "./views";

export function StatusScreen() {
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <TwinStatusGeneral />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
