import { fetchPG001Face } from "@/entities/face";
import { isPopulatedArray, safeWithRedirect } from "@/shared/libs";

import { StatusAlert, WidgetsContainer } from "../../components";
import { Widget } from "../../widgets/types";
import { PGFaceProps } from "../types";

export async function PG001({ pageFaceId, twinId }: PGFaceProps) {
  const pageResult = await safeWithRedirect(() =>
    fetchPG001Face(pageFaceId, twinId)
  );

  if (!pageResult.ok) {
    return (
      <StatusAlert
        variant="error"
        message="Failed to load PG001 layout. Try again later"
      />
    );
  }

  const pageFace = pageResult.data;

  return isPopulatedArray<Widget>(pageFace.widgets) ? (
    <WidgetsContainer
      faceId={pageFaceId}
      widgets={pageFace.widgets}
      twinId={twinId}
      className={pageFace.styleClasses}
    />
  ) : null;
}
