import { FaceWT002, fetchWT002Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { RelatedObjects } from "@/shared/api";
import { cn, safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { fetchModalCreateData } from "../tc/fetch-modal-create-data";
import { WT002Client } from "./wt002-client";

export async function WT002({ widget, twinId }: WidgetFaceProps) {
  const wtResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchWT002Face(widget.widgetFaceId, twinId)
    )
  );

  if (!wtResult.ok) {
    return (
      <StatusAlert variant="error" message="Widget WT002 failed to load." />
    );
  }

  const {
    widget: { buttons },
    relatedObjects,
  } = wtResult.data as { widget: FaceWT002; relatedObjects: RelatedObjects };

  const buttonsWithModalData = await Promise.all(
    (buttons ?? []).map(async (button) => {
      if (!button.modalFaceId) return { button, modalData: undefined };

      const modalFace = relatedObjects?.faceMap?.[button.modalFaceId];
      const modalData = await fetchModalCreateData(modalFace!, twinId!);

      return { button, modalData };
    })
  );

  return (
    <div className={cn(widget.styleClasses)}>
      <WT002Client createButtonsData={buttonsWithModalData} />
    </div>
  );
}
