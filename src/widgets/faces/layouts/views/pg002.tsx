import { fetchPG002Face } from "@/entities/face";
import { isNumber, isPopulatedArray, safe } from "@/shared/libs";

import { Tab, TabsLayout } from "../../../layout";
import { StatusAlert, WidgetsContainer } from "../../components";
import { Widget } from "../../widgets/types";
import { PGFaceProps } from "../types";

export async function PG002({ pageFaceId, twinId }: PGFaceProps) {
  const pageResult = await safe(() => fetchPG002Face(pageFaceId));

  if (!pageResult.ok) {
    return (
      <StatusAlert
        variant="error"
        message="Failed to load PG002 layout. Try again later"
      />
    );
  }

  const { tabs = [] } = pageResult.data;
  const orderedTabs = tabs.sort((a, b) => {
    const aOrder = isNumber(a.order) ? a.order : Infinity;
    const bOrder = isNumber(b.order) ? b.order : Infinity;
    return aOrder - bOrder;
  });

  const tabsItems: Tab[] =
    orderedTabs.map((tab) => ({
      key: tab.title!.toLowerCase(),
      label: tab.title ?? "N/A",
      content: isPopulatedArray<Widget>(tab.widgets) ? (
        <WidgetsContainer
          faceId={tab.id!}
          widgets={tab.widgets}
          twinId={twinId}
          className={tab.styleClasses}
        />
      ) : null,
    })) ?? [];

  return isPopulatedArray(tabs) ? <TabsLayout tabs={tabsItems} /> : null;
}
