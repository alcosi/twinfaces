import { Widget } from "./widgets/types";

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
