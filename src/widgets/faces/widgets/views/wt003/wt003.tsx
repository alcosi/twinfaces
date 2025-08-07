import { fetchWT003Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { WT003Alert } from "./wt003-alert";

export async function WT003({ widget, twinId }: WidgetFaceProps) {
  const result = await withRedirectOnUnauthorized(() =>
    fetchWT003Face(widget.widgetFaceId, twinId)
  )();

  if (!result.ok || !result.data.widget) {
    return (
      <StatusAlert variant="error" message="Widget WT003 failed to load." />
    );
  }

  return <WT003Alert data={result.data.widget} />;
}
