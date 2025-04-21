import { fetchPG002Face } from "@/entities/face";
import { isPopulatedArray, safe } from "@/shared/libs";

import { Tab, TabsLayout } from "../../../layout";
import { AlertError, WidgetLayoutRenderer } from "../../components";
import { Widget } from "../../widgets/types";
import { PGFaceProps } from "../types";

export async function PG002({ pageFaceId, twinId }: NonNullable<PGFaceProps>) {
  const pageResult = await safe(() => fetchPG002Face(pageFaceId));

  if (!pageResult.ok) {
    return (
      <AlertError message="Failed to load PG002 layout. Try again later" />
    );
  }

  const pageFace = pageResult.data;

  const tabs: Tab[] =
    pageFace.tabs?.map((tab) => ({
      key: tab.title!.toLowerCase(),
      label: tab.title ?? "N/A",
      content: isPopulatedArray<Widget>(tab.widgets) ? (
        <WidgetLayoutRenderer
          layout={tab.layout}
          widgets={tab.widgets}
          twinId={twinId}
        />
      ) : null,
    })) ?? [];

  return isPopulatedArray(tabs) ? <TabsLayout tabs={tabs} /> : null;
}
