import { fetchTW004Face } from "@/entities/face";
import { TwinFieldEditor } from "@/features/twin/ui/field-editor";
import { safe } from "@/shared/libs";

import { AlertError } from "../../../components";
import { TWidgetFaceProps } from "../../types";
import { loadTwinFieldInfo } from "./utils";

export async function TW004(props: TWidgetFaceProps) {
  const { twinId, widget } = props;

  const twidgetResult = await safe(() =>
    fetchTW004Face(widget.widgetFaceId, twinId)
  );
  if (!twidgetResult.ok) {
    return <AlertError message="Widget TW004 failed to load." />;
  }
  const twidget = twidgetResult.data;

  const {
    key,
    value,
    descriptor,
    editable,
    twin,
    relatedObjects,
    resourceLinkKey,
  } = await loadTwinFieldInfo(
    twidget.pointedTwinId!,
    twidget.twinClassFieldId!
  );

  return (
    <TwinFieldEditor
      id={twidget.id!}
      twinId={twidget.pointedTwinId!}
      twin={twin}
      relatedObjects={relatedObjects}
      label={
        twidget.label || (
          <label className="px-3 text-sm font-bold italic text-muted">
            Unknown
          </label>
        )
      }
      field={{ key, value, descriptor, editable, resourceLinkKey }}
    />
  );
}
