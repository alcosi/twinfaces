import { fetchTW004Face } from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { isAuthUserGranted } from "@/entities/user/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { TwinFieldEditor } from "@/features/twin/ui/field-editor";
import { cn, safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { TWidgetFaceProps } from "../../types";
import { buildFieldEditorProps } from "./utils";

export async function TW004(props: TWidgetFaceProps) {
  const { twinId, widget, className } = props;

  const isAdmin = await isAuthUserGranted({
    permission: KEY_TO_ID_PERMISSION_MAP.DOMAIN_MANAGE,
  });

  const twidgetResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchTW004Face(widget.widgetFaceId, twinId)
    )
  );
  if (!twidgetResult.ok || !twidgetResult.data.widget) {
    return (
      <StatusAlert variant="error" message="Widget TW004 failed to load." />
    );
  }

  const twidget = twidgetResult.data.widget;

  const result = await buildFieldEditorProps(
    twidget.pointedTwinId!,
    twidget.twinClassFieldId!
  );

  if (!result.ok) {
    return (
      <StatusAlert
        variant="error"
        title={twidget.name}
        message={`Face with id ${twidget.id} failed to load`}
        className="mt-4"
      />
    );
  }

  const { twin, relatedObjects, field } = result.data;

  // NOTE: Not sure yet if we should use it
  // I was not able to reproduce the loading state for this face-widget
  // <Suspense fallback={<p>TW004 loading.....</p>}></Suspense>;
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
