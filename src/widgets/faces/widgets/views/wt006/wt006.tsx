import { fetchWT006Face } from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { isAuthUserGranted } from "@/entities/user/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { TwinFieldEditor } from "@/features/twin/ui/field-editor";
import { cn, isMultiElementArray, safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { buildFieldEditorProps } from "./utils";

export async function WT006(props: WidgetFaceProps) {
  const { twinId, widget, className } = props;

  const isAdmin = await isAuthUserGranted({
    permission: KEY_TO_ID_PERMISSION_MAP.DOMAIN_MANAGE,
  });

  const widgetResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchWT006Face(widget.widgetFaceId, twinId)
    )
  );

  if (!widgetResult.ok || !widgetResult.data.widget) {
    return (
      <StatusAlert variant="error" message="Widget WT006 failed to load." />
    );
  }

  const widgetConfig = widgetResult.data.widget;
  const { id, name, label, fields = [] } = widgetConfig;

  const sortedFields = fields.toSorted(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const fieldEditorPropResults = await Promise.allSettled(
    sortedFields.map(async (field) => {
      return await buildFieldEditorProps(
        widgetConfig.pointedTwinId!,
        field.twinClassFieldId!
      );
    })
  );

  const renderedFields = sortedFields.map((el, index) => {
    if (
      fieldEditorPropResults[index]?.status === "fulfilled" &&
      fieldEditorPropResults[index].value.ok
    ) {
      const { twin, relatedObjects, field } =
        fieldEditorPropResults[index]?.value.data;

      return (
        <TwinFieldEditor
          key={id}
          id={id!}
          label={el.label || "N/A"}
          twinId={widgetConfig.pointedTwinId!}
          twin={twin}
          relatedObjects={relatedObjects}
          field={field}
          disabled={!isAdmin}
          editable={el.editable}
        />
      );
    } else
      return (
        <StatusAlert
          variant="error"
          title={name}
          message={`Face with id ${id} failed to load`}
          className="mt-4"
        />
      );
  });

  return (
    <div data-face-id={id} className={cn(className)}>
      {isMultiElementArray(fields) && label && (
        <span className="text-base font-bold">{label}</span>
      )}
      <div className={cn(className, widgetConfig.styleClasses)}>
        {renderedFields}
      </div>
    </div>
  );
}
