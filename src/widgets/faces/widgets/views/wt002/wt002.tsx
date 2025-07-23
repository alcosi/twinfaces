import { FaceWT002, fetchWT002Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { RelatedObjects } from "@/shared/api";
import { cn, safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { fetchModalCreateData } from "../tc/fetch-modal-create-data";
import { WT002EntryClient } from "./wt002-entry-client";

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
      if (!button.modalFaceId) return { trigger: button, faceData: undefined };

      const modalFace = relatedObjects?.faceMap?.[button.modalFaceId];
      const modalData = await fetchModalCreateData(modalFace!, twinId!);

      // TODO: modalData is wrong. We gotta use `faceTwinCreate`
      return { trigger: button, faceData: modalData };
    })
  );

  return (
    <div className={cn(widget.styleClasses)}>
      {buttonsWithModalData.map((props) => (
        <WT002EntryClient {...props} />
      ))}
    </div>
  );
}
