import { fetchWT003Face } from "@/entities/face";
import { safe } from "@/shared/libs";

import { AlertError } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { WT003Alert } from "./wt003-alert";

export async function WT003({ widget }: WidgetFaceProps) {
  const result = await safe(() => fetchWT003Face(widget.widgetFaceId));

  if (!result.ok) {
    return <AlertError message="Widget WT003 failed to load." />;
  }

  return <WT003Alert data={result.data} />;
}
