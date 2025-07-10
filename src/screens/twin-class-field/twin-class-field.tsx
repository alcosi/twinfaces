import { TwinClassFieldV2_DETAILED } from "@/entities/twin-class-field";
import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinFieldGeneral } from "./views";

export function TwinClassFieldScreen({
  twinFieldId,
  twinField,
}: {
  twinFieldId: string;
  twinField: TwinClassFieldV2_DETAILED;
}) {
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: (
        <TwinFieldGeneral twinFieldId={twinFieldId} twinField={twinField} />
      ),
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
