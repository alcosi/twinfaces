import { fetchWT010Face, getAuthHeaders } from "@/entities/face";
import { TwinClass } from "@/entities/twin-class";
import { fetchTwinById, updateTwinClassById } from "@/entities/twin/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { WT010EntryClient } from "./wt010-entry-client";

export async function WT010(props: WidgetFaceProps) {
  const { twinId, widget } = props;
  const header = await getAuthHeaders();
  const query = {
    showTwinMode: "DETAILED",
    showTwin2TwinClassMode: "DETAILED",
  } as const;

  const widgetResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchWT010Face(widget.widgetFaceId, twinId)
    )
  );

  if (!widgetResult.ok || !widgetResult.data.widget) {
    return (
      <StatusAlert variant="error" message="Widget WT010 failed to load." />
    );
  }

  const { widget: loadedWidget } = widgetResult.data;

  const twinResult = await safe(() =>
    fetchTwinById(loadedWidget.pointedTwinId!, {
      header,
      query,
    })
  );

  if (!twinResult.ok) {
    return (
      <StatusAlert variant="warn" message="Failed to load twin for WT010" />
    );
  }

  async function handleChangeTwinClass(newTwinClassId: string) {
    "use server";
    await updateTwinClassById(loadedWidget.pointedTwinId!, {
      header,
      newTwinClassId,
    });
  }

  //NOTE add wrapper with styleClasses when BE add this param
  return (
    <WT010EntryClient
      faceData={loadedWidget}
      twinClass={twinResult.data.twin.twinClass as TwinClass}
      onChange={handleChangeTwinClass}
    />
  );
}
