import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { DataListOptionContext } from "@/features/datalist-option";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { Tab, TabsLayout } from "@/widgets/layout";

import { DatalistOptionGeneral } from "./views";

export function DatalistOptionScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();
  const { datalistOption, optionId } = useContext(DataListOptionContext);

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Options",
        href: `/${PlatformArea.core}/datalist-options`,
      },
      {
        label: isPopulatedString(datalistOption?.name)
          ? datalistOption.name
          : "N/A",
        href: `/${PlatformArea.core}/datalist-options/${optionId}`,
      },
    ]);
  }, [datalistOption, setBreadcrumbs]);

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
