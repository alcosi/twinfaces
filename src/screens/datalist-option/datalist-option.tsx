import { useContext } from "react";

import { DataListOptionContext } from "@/features/datalist-option";
import { Tab, TabsLayout } from "@/widgets/layout";

import { DatalistOptionGeneral, DatalistOptionProjections } from "./views";

export function DatalistOptionScreen() {
  const { datalistOption } = useContext(DataListOptionContext);

  const tabs: Tab[] = datalistOption
    ? [
        {
          key: "general",
          label: "General",
          content: <DatalistOptionGeneral />,
        },
        {
          key: "projections",
          label: "Projections",
          content: <DatalistOptionProjections />,
        },
      ]
    : [];

  return <TabsLayout tabs={tabs} />;
}
