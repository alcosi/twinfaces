import { notFound } from "next/navigation";

import { getAuthHeaders } from "@/entities/face";
import { Twin_DETAILED, fetchTwinById } from "@/entities/twin/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { isNotFoundError, safe } from "@/shared/libs";

import { StatusAlert } from "../components";
import { LayoutRenderer } from "./renderer";

type Props = {
  twinId: string;
};

/**
 * Renders the page face of a twin: loads the twin and renders the layout its
 * `pageFaceId` resolves to, with the twin as the page `twinId`.
 */
export async function TwinPageRenderer({ twinId }: Props) {
  const header = await getAuthHeaders();
  const query = {
    showTwinMode: "DETAILED",
    showTwin2TwinClassMode: "DETAILED",
    showTwinClassPage2FaceMode: "DETAILED",
    showTwin2FaceMode: "DETAILED",
  } as const;

  const result = await safe(
    withRedirectOnUnauthorized(() =>
      fetchTwinById<Twin_DETAILED>(twinId, { header, query })
    )
  );

  if (!result.ok) {
    if (isNotFoundError(result.error)) notFound();

    throw result.error;
  }

  const { twin } = result.data;

  if (!twin.pageFaceId) {
    return (
      <StatusAlert
        variant="warn"
        title="Page not set up yet"
        message="We're working on it. Please check back soon!"
        className="mt-4"
      />
    );
  }

  return <LayoutRenderer pageFaceId={twin.pageFaceId} twinId={twin.id} />;
}
