import { fetchPG001Face } from "@/entities/face";
import { isPopulatedArray, safe } from "@/shared/libs";

import { AlertError, WidgetLayoutRenderer } from "../../components";
import { Widget } from "../../widgets/types";
import { PGFaceProps } from "../types";

export async function PG001({ pageFaceId, twinId }: NonNullable<PGFaceProps>) {
  const pageResult = await safe(() => fetchPG001Face(pageFaceId));

  if (!pageResult.ok) {
    return (
      <AlertError message="Failed to load PG001 layout. Try again later" />
    );
  }

  const pageFace = pageResult.data;

  return isPopulatedArray<Widget>(pageFace.widgets) ? (
    <WidgetLayoutRenderer
      layout={pageFace.layout}
      widgets={pageFace.widgets}
      twinId={twinId}
    />
  ) : null;
}
