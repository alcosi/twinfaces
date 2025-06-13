import { useContext } from "react";

import { DataListOptionContext } from "@/features/datalist-option";
import { Tab, TabsLayout } from "@/widgets/layout";

import { DatalistOptionGeneral } from "./views";

export function DatalistOptionScreen() {
  const { datalistOption } = useContext(DataListOptionContext);

  const tabs: Tab[] = datalistOption
    ? [
        {
          key: "general",
          label: "General",
          content: <DatalistOptionGeneral />,
        },
      ]
    : [];

  return <TabsLayout tabs={tabs} />;
}
