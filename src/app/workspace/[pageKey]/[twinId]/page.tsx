import { notFound } from "next/navigation";

import { getAuthHeaders } from "@/entities/face";
import { Twin_DETAILED, fetchTwinById } from "@/entities/twin/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { safe } from "@/shared/libs";
import { StatusAlert } from "@/widgets/faces/components";
import { LayoutRenderer } from "@/widgets/faces/layouts";

type Props = {
  params: Promise<{
    pageKey: string;
    twinId: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const header = await getAuthHeaders();
  const query = {
    showTwinMode: "DETAILED",
    showTwin2TwinClassMode: "DETAILED",
    showTwinClassPage2FaceMode: "DETAILED",
  } as const;
  const result = await safe(
    withRedirectOnUnauthorized(() =>
      fetchTwinById<Twin_DETAILED>(params.twinId, { header, query })
    )
  );

  if (!result.ok) {
    notFound();
  }

  const twin = result.data;
  if (twin.twinClass?.pageFaceId) {
    return (
      <LayoutRenderer pageFaceId={twin.twinClass.pageFaceId} twinId={twin.id} />
    );
  }

  return (
    <StatusAlert
      variant="warn"
      title="Page not set up yet"
      message="We're working on it. Please check back soon!"
      className="mt-4"
    />
  );
}
