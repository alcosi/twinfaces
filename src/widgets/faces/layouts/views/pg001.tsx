import { fetchPG001Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { isPopulatedArray, isUndefined, safe } from "@/shared/libs";

import { StatusAlert, WidgetsContainer } from "../../components";
import { Widget } from "../../widgets/types";
import { PGFaceProps } from "../types";

export async function PG001({ pageFaceId, twinId }: PGFaceProps) {
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
    withRedirectOnUnauthorized(() => fetchPG001Face(pageFaceId, twinId))
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
