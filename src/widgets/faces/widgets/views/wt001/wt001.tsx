import { FaceWT001, fetchWidgetFace } from "@/entities/face";
import { safe } from "@/shared/libs";

import { AlertError } from "../../../alert-error";
import { WT001Client } from "./wt001-client";

export async function WT001({ widgetFaceId }: { widgetFaceId: string }) {
  const result = await safe(() => fetchWidgetFace(widgetFaceId));

  if (!result.ok) {
    return <AlertError message="Widget WT001 failed to load." />;
  }

  const widget: FaceWT001 = result.data;

  return (
    <WT001Client
      title={widget.label}
      baseTwinClassId={widget.twinClassId}
      enabledColumns={widget.showColumns}
    />
  );
}
