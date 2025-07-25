import { fetchTW004Face } from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { isAuthUserGranted } from "@/entities/user/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { TwinFieldEditor } from "@/features/twin/ui/field-editor";
import { cn, isFalsy, safe } from "@/shared/libs";

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
  const { id, name, label, fields = [] } = twidget;

  const fieldEditorPropResults = await Promise.all(
    fields.map(async (field) => {
      return await buildFieldEditorProps(
        twidget.pointedTwinId!,
        field.twinClassFieldId!
      );
    })
  );

  const dataResult = fieldEditorPropResults
    .filter((res) => res?.ok)
    .map((res) => res.data);

  const sortedFields = fields.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div data-face-id={id} className={cn(className)}>
      {fields.length > 1 && label && (
        <span className="text-sm font-bold">{label}</span>
      )}
      <div className={cn(className, twidget.styleClasses)}>
        {sortedFields.map((el) => {
          const elementResult = dataResult.find(
            (element) => element?.field.id === el.twinClassFieldId
          );

          if (isFalsy(elementResult))
            return (
              <StatusAlert
                variant="error"
                title={name}
                message={`Face with id ${id} failed to load`}
                className="mt-4"
              />
            );

          const { twin, relatedObjects, field } = elementResult;

          return (
            <TwinFieldEditor
              id={id!}
              label={el.label || "N/A"}
              twinId={twidget.pointedTwinId!}
              twin={twin}
              relatedObjects={relatedObjects}
              field={field}
              disabled={isFalsy(isAdmin)}
              editable={el.editable}
            />
          );
        })}
      </div>
    </div>
  );
}
