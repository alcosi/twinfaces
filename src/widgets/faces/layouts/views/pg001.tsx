import { fetchPG001Face } from "@/entities/face";
import { isPopulatedArray, safe } from "@/shared/libs";

import { AlertError, WidgetLayoutRenderer } from "../../components";
import { Widget } from "../../widgets/types";
import { PGFaceProps, PGLayouts } from "../types";

export async function PG001({ pageFaceId, twinId }: PGFaceProps) {
  const pageResult = await safe(() => fetchPG001Face(pageFaceId));

  if (!pageResult.ok) {
    return (
      <AlertError message="Failed to load PG001 layout. Try again later" />
    );
  }

  const pageFace = pageResult.data;

  console.log("foobar pageFace", pageFace);
  return isPopulatedArray<Widget>(pageFace.widgets) ? (
    <WidgetLayoutRenderer
      layout={pageFace.layout as PGLayouts}
      widgets={pageFace.widgets}
      twinId={twinId}
    />
  ) : null;
}
