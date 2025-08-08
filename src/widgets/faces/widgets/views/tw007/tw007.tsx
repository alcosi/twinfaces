import { fetchTW007Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { TWidgetFaceProps } from "../../types";
import { TW007EntryClient } from "./tw007-entry-client";

export async function TW007(props: TWidgetFaceProps) {
  const { twinId, widget } = props;

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

  console.log("tw007result", twidgetResult);

  //NOTE add wrapper with styleClasses when BE add this param
  return <TW007EntryClient faceData={loadedWidget} />;
}
