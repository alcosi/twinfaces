import { fetchTwidgetFace } from "@/entities/face";
import { safe } from "@/shared/libs";

import { AlertError } from "../../alert-error";
import { TWidgetProps } from "../types";

export async function TW001({ widgetFaceId, twinId }: TWidgetProps) {
  const result = await safe(() => fetchTwidgetFace(widgetFaceId, twinId));

  if (!result.ok) {
    return <AlertError message="Widget TW001 failed to load." />;
  }

  return (
    <div className="max-w-[624px] h-full">
      <p>SLIDER</p>
    </div>
  );
}
