import { fetchTW005Face, getAuthHeaders } from "@/entities/face";
import { fetchTwinById } from "@/entities/twin/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { cn, safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { TWidgetFaceProps } from "../../types";
import { TW005Buttons } from "./tw005-buttons";

export async function TW005(props: TWidgetFaceProps) {
  const { twinId, widget } = props;

  const header = await getAuthHeaders();
  const query = {
    showTwin2TransitionMode: "DETAILED",
  } as const;

  const faceResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchTW005Face(widget.widgetFaceId, twinId)
    )
  );

  if (!faceResult.ok || !faceResult.data.widget) {
    return (
      <StatusAlert variant="error" message="Widget TW005 failed to load." />
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
      <TW005Buttons
        transitionButtons={buttons}
        transitionIdList={transitionsIdList}
        twinId={pointedTwinId}
      />
    </div>
  );
}
