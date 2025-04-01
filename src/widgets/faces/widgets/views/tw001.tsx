import { fetchTwidgetFace } from "@/entities/face";
import { cn, safe } from "@/shared/libs";

import { AlertError } from "../../alert-error";
import { widgetGridClasses } from "../../layouts/utils";
import { TWidgetFaceProps } from "../types";

export async function TW001(props: TWidgetFaceProps) {
  const { twinId, face, widget } = props;

  const result = await safe(() =>
    fetchTwidgetFace(widget.widgetFaceId, twinId)
  );

  if (!result.ok) {
    return <AlertError message="Widget TW001 failed to load." />;
  }

  return (
    <div className={cn("max-w-[624px] h-full", widgetGridClasses(widget))}>
      <p>{face.name}</p>
    </div>
  );
}
