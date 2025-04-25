import { ReactNode } from "react";

import { getAuthHeaders } from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { isGranted } from "@/entities/user/server";
import { ViewAsAdminButton } from "@/features/twin/ui";
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

export async function WidgetLayoutRenderer({
  layout = "ONE_COLUMN",
  widgets,
  twinId,
}: Props) {
  const columns = ColumnsCountMap[layout];

  const { currentUserId } = await getAuthHeaders();
  const isAdmin = await isGranted({
    userId: currentUserId,
    permission: KEY_TO_ID_PERMISSION_MAP.DOMAIN_MANAGE,
  });

  return (
    <main className="flex flex-col gap-4 py-4 md:flex-row">
      {Array.from({ length: columns }, (_, i) => (
        <div key={i} className="flex w-full flex-1 flex-col gap-4">
          {mapWidgetsToNodes(
            widgets.filter((widget) => widget.column === i + 1),
            twinId
          )}
        </div>
      ))}
      {isAdmin && twinId && <ViewAsAdminButton twinId={twinId} />}
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
