import { fetchWT007Face, getAuthHeaders } from "@/entities/face";
import { fetchTwinById } from "@/entities/twin/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { cn, safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { WT007Buttons } from "./wt007-buttons";

export async function WT007(props: WidgetFaceProps) {
  const { twinId, widget } = props;

  const header = await getAuthHeaders();
  const query = {
    showTwin2TransitionMode: "DETAILED",
  } as const;

  const faceResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchWT007Face(widget.widgetFaceId, twinId)
    )
  );

  if (!faceResult.ok || !faceResult.data.widget) {
    return (
      <StatusAlert variant="error" message="Widget WT007 failed to load." />
    );
  }

  const { id, pointedTwinId = "", buttons = [] } = faceResult.data.widget;

  const twinResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchTwinById(pointedTwinId, { header, query })
    )
  );

  if (!twinResult.ok) {
    return <StatusAlert variant="error" message="Failed to load twin." />;
  }

  const { twin } = twinResult.data;
  const { transitionsIdList = [] } = twin;

  return (
    <div data-face-id={id} className={cn("flex gap-2", widget.styleClasses)}>
      <WT007Buttons
        transitionButtons={buttons}
        transitionIdList={transitionsIdList}
        twinId={pointedTwinId}
      />
    </div>
  );
}
