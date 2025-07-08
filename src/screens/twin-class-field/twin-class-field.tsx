"use client";

import { TwinClassFieldV2_DETAILED } from "@/entities/twin-class-field";
import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinFieldGeneral } from "./views";

export function TwinClassFieldScreen({
  twinFieldId,
  twinField,
  refresh,
}: {
  twinFieldId: string;
  twinField: TwinClassFieldV2_DETAILED;
  refresh: () => Promise<void>;
}) {
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: (
        <TwinFieldGeneral
          twinFieldId={twinFieldId}
          twinField={twinField}
          refresh={refresh}
        />
      ),
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
