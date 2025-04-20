import { fetchTW005Face, getAuthHeaders } from "@/entities/face";
import { fetchTwinById } from "@/entities/twin/server";
import { TransitionPerformButton } from "@/features/twin-flow-transition/transition-perform-button";
import { safe } from "@/shared/libs";

import { AlertError } from "../../components";
import { TWidgetFaceProps } from "../types";

export async function TW005(props: TWidgetFaceProps) {
  const { twinId, widget } = props;

  const header = await getAuthHeaders();
  const query = {
    showTwin2TransitionMode: "DETAILED",
  } as const;

  const faceResult = await safe(() =>
    fetchTW005Face(widget.widgetFaceId, twinId)
  );

  if (!faceResult.ok) {
    return <AlertError message="Widget TW005 failed to load." />;
  }

  const { pointedTwinId = "", buttons = [] } = faceResult.data;

  const twinResult = await safe(() =>
    fetchTwinById(pointedTwinId, { header, query })
  );

  if (!twinResult.ok) {
    return <AlertError message="Failed to load twin." />;
  }

  const { transitionsIdList = [] } = twinResult.data;
  const availableTransitions = buttons
    .filter(
      (btn) => btn.transitionId && transitionsIdList.includes(btn.transitionId)
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="flex gap-2">
      {availableTransitions.map((transitionButton) => (
        <TransitionPerformButton
          key={transitionButton.id}
          twinId={pointedTwinId}
          transitionId={transitionButton.transitionId!}
        >
          {transitionButton.label}
        </TransitionPerformButton>
      ))}
    </div>
  );
}
