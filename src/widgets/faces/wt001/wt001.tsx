import { FaceWT001, fetchWidgetFace } from "@/entities/face";

import { WT001Client } from "./wt001-client";

export async function WT001Face({ widgetFaceId }: { widgetFaceId: string }) {
  const widget: FaceWT001 = await fetchWidgetFace(widgetFaceId);

  return (
    <WT001Client title={widget.label} baseTwinClassId={widget.twinClassId} />
  );
}
