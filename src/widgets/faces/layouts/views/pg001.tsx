import { Suspense } from "react";

import { fetchPG001Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { isPopulatedArray, safe } from "@/shared/libs";

import { StatusAlert, WidgetsContainer } from "../../components";
import { Widget } from "../../widgets/types";
import { PGFaceProps } from "../types";

export async function PG001({ pageFaceId, twinId }: PGFaceProps) {
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

  // TODO: Please create a PG001Skeleton component that mimics the layout of PG001 while its data is loading
  // and update the fallback of the <Suspense> above to use <PG001Skeleton /> instead of the temporary placeholder
  return isPopulatedArray<Widget>(pageFace.widgets) ? (
    <Suspense fallback={<div>PG001 loading...</div>}>
      <WidgetsContainer
        faceId={pageFaceId}
        widgets={pageFace.widgets}
        twinId={twinId}
        className={pageFace.styleClasses}
      />
    </Suspense>
  ) : null;
}
