import { ReactNode } from "react";

import { fetchPageFace } from "@/entities/face";
import { cn, isPopulatedArray, safe } from "@/shared/libs";

import { AlertError } from "../../alert-error";
import { WidgetRenderer } from "../../widgets";
import { PGFaceProps } from "../types";

export async function PG001({ pageFaceId, twinId }: PGFaceProps) {
  const pageResult = await safe(() => fetchPageFace(pageFaceId));

  if (!pageResult.ok) {
    return (
      <AlertError message="Failed to load PG001 layout. Try again later" />
    );
  }

  const pageFace = pageResult.data;

  const layoutVariant = {
    ONE_COLUMN: "flex flex-col gap-4",
    TWO_COLUMNS: "grid grid-cols-2 gap-4",
    THREE_COLUMNS: "grid grid-cols-3 gap-4",
  }[pageFace.layout ?? "ONE_COLUMN"];

  return (
    <main className={cn("py-4", layoutVariant)}>
      {isPopulatedArray(pageFace.widgets) &&
        pageFace.widgets.reduce<ReactNode[]>((acc, widget) => {
          if (widget.widgetFaceId) {
            acc.push(
              <WidgetRenderer
                key={widget.id}
                widgetFaceId={widget.widgetFaceId}
                twinId={twinId}
              />
            );
          }
          return acc;
        }, [])}
    </main>
  );
}
