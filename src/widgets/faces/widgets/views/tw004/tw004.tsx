import { fetchTW004Face } from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { isAuthUserGranted } from "@/entities/user/server";
import { TwinFieldEditor } from "@/features/twin/ui/field-editor";
import { cn, safeWithRedirect } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { TWidgetFaceProps } from "../../types";
import { buildFieldEditorProps } from "./utils";

export async function TW004(props: TWidgetFaceProps) {
  const { twinId, widget, className } = props;

  const isAdmin = await isAuthUserGranted({
    permission: KEY_TO_ID_PERMISSION_MAP.DOMAIN_MANAGE,
  });

  const twidgetResult = await safeWithRedirect(() =>
    fetchTW004Face(widget.widgetFaceId, twinId)
  );
  if (!twidgetResult.ok) {
    return (
      <StatusAlert variant="error" message="Widget TW004 failed to load." />
    );
  }

  const twidget = twidgetResult.data;

  const { twin, relatedObjects, field } = await buildFieldEditorProps(
    twidget.pointedTwinId!,
    twidget.twinClassFieldId!
  );

  return (
    <div
      data-face-id={twidget.id}
      className={cn(className, widget.styleClasses)}
    >
      <TwinFieldEditor
        id={twidget.id!}
        label={twidget.label || "Unknown"}
        twinId={twidget.pointedTwinId!}
        twin={twin}
        relatedObjects={relatedObjects}
        field={field}
        mode={isAdmin ? "admin" : undefined}
        editable={twidget.editable}
      />
    </div>
  );
}
