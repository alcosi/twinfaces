import { Suspense } from "react";

import { fetchPG002Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { TabSkeleton } from "@/features/ui/skeletons";
import { isNumber, isPopulatedArray, isUndefined, safe } from "@/shared/libs";

import { Tab, TabsLayout } from "../../../layout";
import { StatusAlert, WidgetsContainer } from "../../components";
import { Widget } from "../../widgets/types";
import { PGFaceProps } from "../types";

export async function PG002({ pageFaceId, twinId }: PGFaceProps) {
  // twinId is a required query param for face component endpoints (TWINS-943);
  // general pages take it from the navbar menu item's targetTwinId.
  if (isUndefined(twinId)) {
    return (
      <StatusAlert
        variant="warn"
        title="Missing twinId"
        message="This page is not linked to a twin. Check the targetTwinId of the navbar menu item."
      />
    );
  }

  const pageResult = await safe(
    withRedirectOnUnauthorized(() => fetchPG002Face(pageFaceId, twinId))
  );

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
      key: normalizeTabKey(tab.title!),
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

  return isPopulatedArray(tabs) ? (
    <Suspense fallback={<TabSkeleton />}>
      <TabsLayout tabs={tabsItems} />
    </Suspense>
  ) : null;
}

function normalizeTabKey(title: string) {
  return title.toLowerCase().replace(/\s+/g, "_");
}
