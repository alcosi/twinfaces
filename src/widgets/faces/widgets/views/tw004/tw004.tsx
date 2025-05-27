import { fetchTW004Face, getAuthHeaders } from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { isGranted } from "@/entities/user/server";
import { TwinFieldEditor } from "@/features/twin/ui/field-editor";
import { cn, safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { TWidgetFaceProps } from "../../types";
import { buildFieldEditorProps } from "./utils";

export async function TW004(props: TWidgetFaceProps) {
  const { twinId, widget, className } = props;

  const { currentUserId } = await getAuthHeaders();
  const isAdmin = await isGranted({
    userId: currentUserId,
    permission: KEY_TO_ID_PERMISSION_MAP.DOMAIN_MANAGE,
  });

  const twidgetResult = await safe(() =>
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
        editable={twidget.editable!}
      />
    </div>
  );
}
