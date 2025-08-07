import { fetchTW007Face, getAuthHeaders } from "@/entities/face";
import {
  changeTwinClassOfCurrentTwin,
  fetchTwinById,
} from "@/entities/twin/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { TWidgetFaceProps } from "../../types";
import { TW007EntryClient } from "./tw007-entry-client";

export async function TW007(props: TWidgetFaceProps) {
  const { twinId, widget } = props;
  const header = await getAuthHeaders();
  const query = {
    showTwinMode: "DETAILED",
    showTwin2TwinClassMode: "DETAILED",
  } as const;

  const twidgetResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchTW007Face(widget.widgetFaceId, twinId)
    )
  );

  if (!twidgetResult.ok || !twidgetResult.data.widget) {
    return (
      <StatusAlert variant="error" message="Widget TW007 failed to load." />
    );
  }

  const { widget: loadedWidget } = twidgetResult.data;

  const twinResult = await safe(() =>
    fetchTwinById(loadedWidget.pointedTwinId!, {
      header,
      query,
    })
  );

  if (!twinResult.ok) {
    return (
      <StatusAlert variant="warn" message="Failed to load twin for TW007" />
    );
  }

  async function handleChangeTwinClass(payload: { newTwinClassId: string }) {
    "use server";
    await changeTwinClassOfCurrentTwin(twinId, { header, payload });
  }

  //NOTE add wrapper with styleClasses when BE add this param
  return (
    <TW007EntryClient
      faceData={loadedWidget}
      twinClassName={twinResult.data.twinClass?.name}
      onChangeTwinClass={handleChangeTwinClass}
    />
  );
}
