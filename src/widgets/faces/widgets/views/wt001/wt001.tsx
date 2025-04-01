import { FaceWT001, fetchWT001Face } from "@/entities/face";
import { safe } from "@/shared/libs";

import { AlertError } from "../../../alert-error";
import { WidgetFaceProps } from "../../types";
import { WT001Client } from "./wt001-client";

export async function WT001({ widget }: WidgetFaceProps) {
  const wt001FaceResult = await safe(() => fetchWT001Face(widget.widgetFaceId));

  if (!wt001FaceResult.ok) {
    return <AlertError message="Widget WT001 failed to load." />;
  }

  const wt001Face: FaceWT001 = wt001FaceResult.data;

  return (
    <WT001Client
      title={wt001Face.label}
      baseTwinClassId={wt001Face.twinClassId}
      enabledColumns={wt001Face.showColumns}
    />
  );
}
