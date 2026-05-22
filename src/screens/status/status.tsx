import { Tab, TabsLayout } from "@/widgets/layout";

import {
  TwinStatusGeneral,
  TwinStatusTransitions,
  TwinStatusTriggers,
} from "./views";

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
    {
      key: "transitions",
      label: "Transitions",
      content: <TwinStatusTransitions />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
