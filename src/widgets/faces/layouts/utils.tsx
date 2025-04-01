import { ReactNode } from "react";

import { PartialFields } from "@/shared/libs";

import { WidgetRenderer } from "../widgets";
import { Widget } from "../widgets/types";

export function mapWidgetsToNodes(
  widgets: PartialFields<Widget, "id" | "widgetFaceId">[],
  twinId?: string
): ReactNode[] {
  return widgets
    .filter((w): w is Widget => !!w.id && !!w.widgetFaceId)
    .map((widget) => (
      <WidgetRenderer key={widget.id} twinId={twinId} widget={widget} />
    ));
}

export function widgetGridClasses(widget: Widget): string {
  const { column, columnEnd, columnSpan, row, rowEnd, rowSpan } = widget;

  return [
    column && `col-start-${column}`,
    columnEnd && `col-end-${columnEnd}`,
    columnSpan && `col-span-${columnSpan}`,
    row && `row-start-${row}`,
    rowEnd && `row-end-${rowEnd}`,
    rowSpan && `row-span-${rowSpan}`,
  ]
    .filter(Boolean)
    .join(" ");
}
