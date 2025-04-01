import { fetchPG002Face } from "@/entities/face";
import { cn, isPopulatedArray, safe } from "@/shared/libs";

import { Tab, TabsLayout } from "../../../layout";
import { AlertError } from "../../alert-error";
import { PGLayoutStyleMap } from "../constants";
import { PGFaceProps } from "../types";
import { mapWidgetsToNodes } from "../utils";

export async function PG002({ pageFaceId, twinId }: PGFaceProps) {
  const pageResult = await safe(() => fetchPG002Face(pageFaceId));

  if (!pageResult.ok) {
    return (
      <AlertError message="Failed to load PG002 layout. Try again later" />
    );
  }

  const pageFace = pageResult.data;

  const tabs: Tab[] =
    pageFace.tabs?.map((tab) => {
      const layoutVariant = PGLayoutStyleMap[tab.layout ?? "ONE_COLUMN"];

      return {
        key: tab.title!.toLowerCase(),
        label: tab.title ?? "N/A",
        content: (
          <main className={cn(layoutVariant)}>
            {isPopulatedArray(tab.widgets) &&
              mapWidgetsToNodes(tab.widgets, twinId)}
          </main>
        ),
      };
    }) ?? [];

  return isPopulatedArray(tabs) ? <TabsLayout tabs={tabs} /> : null;
}
