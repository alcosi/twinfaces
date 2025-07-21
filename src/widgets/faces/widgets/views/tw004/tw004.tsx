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

  const fields = twidget.fields ?? [];
  const buildPropsPromises = fields.map(async (field) => {
    return await buildFieldEditorProps(
      twidget.pointedTwinId!,
      field.twinClassFieldId!
    );
  });
  const buildPropsResults = await Promise.all(buildPropsPromises);

  const dataResults = buildPropsResults
    .filter((res) => res?.ok)
    .map((res) => {
      const { twin, relatedObjects, field } = res.data;
      return { twin, relatedObjects, field };
    });

  if (dataResults.length === 0) {
    return (
      <StatusAlert
        variant="error"
        title={twidget.name}
        message={`Face with id ${twidget.id} failed to load`}
        className="mt-4"
      />
    );
  }

  return (
    <div data-face-id={twidget.id} className={cn(className)}>
      {fields.length > 1 && twidget.label && (
        <div className="text-s font-bold">{twidget.label}</div>
      )}
      <div className={cn(className, twidget.styleClasses)}>
        {fields
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((el) => {
            const elementResult = dataResults.find(
              (element) => element?.field.id === el.twinClassFieldId
            );

            if (!elementResult) return null;

            return (
              <TwinFieldEditor
                id={twidget.id!}
                label={el.label || "Unknown"}
                twinId={twidget.pointedTwinId!}
                twin={elementResult.twin}
                relatedObjects={elementResult.relatedObjects}
                field={elementResult.field}
                disabled={!isAdmin}
                editable={el.editable}
              />
            );
          })}
      </div>
    </div>
  );
}
