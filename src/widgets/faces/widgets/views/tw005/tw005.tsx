import { fetchTW005Face, getAuthHeaders } from "@/entities/face";
import { fetchTwinById } from "@/entities/twin/server";
import { safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { TWidgetFaceProps } from "../../types";
import { TW005Buttons } from "./tw005-buttons";

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
    return (
      <StatusAlert variant="error" message="Widget TW005 failed to load." />
    );
  }

  const { pointedTwinId = "", buttons = [] } = faceResult.data;

  const twinResult = await safe(() =>
    fetchTwinById(pointedTwinId, { header, query })
  );

  if (!twinResult.ok) {
    return <StatusAlert variant="error" message="Failed to load twin." />;
  }

  const { transitionsIdList = [] } = twinResult.data;

  return (
    <TW005Buttons
      transitionsButtons={buttons}
      transitionsIdList={transitionsIdList}
      twinId={pointedTwinId}
      className={widget.styleClasses}
    />
  );
}
