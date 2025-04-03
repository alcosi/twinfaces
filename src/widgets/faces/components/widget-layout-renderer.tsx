import { ReactNode } from "react";

import { PartialFields } from "@/shared/libs";

import { PGLayouts } from "../layouts/types";
import { WidgetRenderer } from "../widgets";
import { Widget } from "../widgets/types";

type Props = {
  layout?: PGLayouts;
  widgets: Widget[];
  twinId?: string;
};

const ColumnsCountMap: Record<PGLayouts, number> = {
  ONE_COLUMN: 1,
  TWO_COLUMNS: 2,
  THREE_COLUMNS: 3,
} as const;

export function WidgetLayoutRenderer({
  layout = "ONE_COLUMN",
  widgets,
  twinId,
}: Props) {
  const columns = ColumnsCountMap[layout];

  return (
    <main className="flex flex-col gap-4 py-4 md:flex-row">
      {Array.from({ length: columns }, (_, i) => (
        <div key={i} className="flex w-full flex-1 flex-col gap-2">
          {mapWidgetsToNodes(
            widgets.filter((widget) => widget.column === i + 1),
            twinId
          )}
        </div>
      ))}
    </main>
  );
}

function mapWidgetsToNodes(
  widgets: PartialFields<Widget, "id" | "widgetFaceId">[],
  twinId?: string
): ReactNode[] {
  return widgets
    .filter((w): w is Widget => !!w.id && !!w.widgetFaceId)
    .map((widget) => (
      <WidgetRenderer key={widget.id} twinId={twinId} widget={widget} />
    ));
}
