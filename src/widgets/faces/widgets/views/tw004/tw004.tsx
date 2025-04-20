import { fetchTW004Face } from "@/entities/face";
import { TwinFieldEditor } from "@/features/twin/ui/field-editor";
import { safe } from "@/shared/libs";

import { AlertError } from "../../../components";
import { TWidgetFaceProps } from "../../types";
import { buildFieldEditorProps } from "./utils";

export async function TW004(props: TWidgetFaceProps) {
  const { twinId, widget } = props;

  const twidgetResult = await safe(() =>
    fetchTW004Face(widget.widgetFaceId, twinId)
  );
  if (!twidgetResult.ok) {
    return <AlertError message="Widget TW004 failed to load." />;
  }
  const twidget = twidgetResult.data;

  const { twin, relatedObjects, field } = await buildFieldEditorProps(
    twidget.pointedTwinId!,
    twidget.twinClassFieldId!
  );

  return (
    <TwinFieldEditor
      id={twidget.id!}
      label={twidget.label || "Unknown"}
      twinId={twidget.pointedTwinId!}
      twin={twin}
      relatedObjects={relatedObjects}
      field={field}
    />
  );
}
