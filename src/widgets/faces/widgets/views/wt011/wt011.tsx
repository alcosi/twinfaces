import {
  FaceWT011Column,
  FaceWT011Field,
  FaceWT011Row,
  FaceWT011Section,
  fetchWT011Face,
} from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { cn, safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { fetchFieldEditorTwin, resolveEditorField } from "../wt006/utils";
import {
  WT011Client,
  WT011ClientColumn,
  WT011ClientField,
  WT011ClientRow,
  WT011ClientSection,
} from "./wt011-client";

/**
 * WT011 — a twin form with a fully declarative layout:
 * Form → Columns → Sections → Rows → Fields.
 *
 * Shows the fields of the pointed twin. The form can be switched into an edit
 * mode when the pointed twin has the EDIT action; in view mode the editable
 * fields can still be edited one by one in place.
 */
export async function WT011({ twinId, widget, className }: WidgetFaceProps) {
  const faceResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchWT011Face(widget.widgetFaceId, twinId)
    )
  );

  if (!faceResult.ok || !faceResult.data.widget) {
    return (
      <StatusAlert variant="error" message="Widget WT011 failed to load." />
    );
  }

  const config = faceResult.data.widget;
  const faceRelated = faceResult.data.relatedObjects;
  const formTwinId = config.pointedTwinId ?? twinId;

  const twinResult = await fetchFieldEditorTwin(formTwinId);

  if (!twinResult.ok) {
    return (
      <StatusAlert variant="error" message="Widget WT011 failed to load." />
    );
  }

  const { twin, relatedObjects } = twinResult.data;

  // The edit mode of the whole form needs EDIT among the pointed twin's
  // actions; a single field is edited in place when the twin reports it
  // `editable` in its `fieldsMap`.
  const canEdit =
    faceRelated?.twinMap?.[formTwinId]?.actions?.includes("EDIT") ?? false;

  function toField(dto: FaceWT011Field): WT011ClientField {
    const fieldId = dto.twinClassFieldId ?? "";
    const classField =
      faceRelated?.twinClassFieldMap?.[fieldId] ??
      relatedObjects?.twinClassFieldMap?.[fieldId];
    const resolved = resolveEditorField({ twin, relatedObjects, fieldId });
    const field = resolved.ok ? resolved.data.field : undefined;

    return {
      id: dto.id ?? fieldId,
      label: dto.label || classField?.name || field?.key || "N/A",
      required: classField?.required ?? false,
      widthWeight: dto.widthWeight,
      styleClasses: dto.styleClasses,
      field,
      editable: field?.editable === true && !!field.descriptor,
    };
  }

  function toRow(dto: FaceWT011Row): WT011ClientRow {
    return {
      id: dto.id ?? "",
      allowWrap: dto.allowWrap ?? true,
      styleClasses: dto.styleClasses,
      fields: byOrder(dto.fields).map(toField),
    };
  }

  function toSection(dto: FaceWT011Section): WT011ClientSection {
    return {
      id: dto.id ?? "",
      label: dto.label,
      styleClasses: dto.styleClasses,
      rows: byOrder(dto.rows).map(toRow),
    };
  }

  function toColumn(dto: FaceWT011Column): WT011ClientColumn {
    return {
      id: dto.id ?? "",
      widthWeight: dto.widthWeight,
      stackOrder: dto.adaptiveOrder ?? dto.order ?? 0,
      styleClasses: dto.styleClasses,
      sections: byOrder(dto.sections).map(toSection),
    };
  }

  return (
    <div
      data-face-id={config.id}
      className={cn(className, config.styleClasses)}
    >
      <WT011Client
        title={config.label}
        submitLabel={config.submitLabel || "Save"}
        cancelLabel={config.cancelLabel || "Cancel"}
        twinId={formTwinId}
        twin={twin}
        relatedObjects={relatedObjects}
        canEdit={canEdit}
        columns={byOrder(config.columns).map(toColumn)}
      />
    </div>
  );
}

// Every level arrives sorted by the backend; sorting again keeps the layout
// right even if it does not.
function byOrder<T extends { order?: number }>(items?: T[]): T[] {
  return (items ?? []).toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
