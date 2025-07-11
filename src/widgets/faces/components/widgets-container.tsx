import { ReactNode, Suspense, use } from "react";

import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { isAuthUserGranted } from "@/entities/user/server";
import { ViewAsAdminButton } from "@/features/twin/ui";
import { MasonryLayout } from "@/features/ui/masonry";
import { PartialFields, cn } from "@/shared/libs";

import { WidgetRenderer } from "../widgets";
import { Widget } from "../widgets/types";

type Props = {
  faceId: string;
  className?: string | string[];
  widgets: Widget[];
  twinId?: string;
};

export async function WidgetsContainer({
  faceId,
  className,
  widgets,
  twinId,
}: Props) {
  const isAdmin = await isAuthUserGranted({
    permission: KEY_TO_ID_PERMISSION_MAP.DOMAIN_MANAGE,
  });

  return (
    <section data-face-id={faceId} className={cn(className)}>
      {
        // NOTE Incorrect order of widgets display when fallback is enabled check please @Kerim Berdimyradov
      }
      {/* <MasonryLayout className={cn(className)}> */}
      {/* <Suspense fallback={<p className="bg-red-700">WIDGETS loading.....</p>}> */}
      {mapWidgetsToNodes(widgets, twinId)}
      {/* </Suspense> */}
      {/* </MasonryLayout> */}
      {isAdmin && twinId && <ViewAsAdminButton twinId={twinId} />}
    </section>
  );
}

function mapWidgetsToNodes(
  widgets: PartialFields<Widget, "id" | "widgetFaceId">[],
  twinId?: string
): ReactNode[] {
  return widgets
    .filter((w): w is Widget => !!w.id && !!w.widgetFaceId)
    .map((widget) => {
      return (
        <div key={widget.id} className="min-h-8 bg-gray-100">
          {
            // NOTE Incorrect order of widgets display when fallback is enabled check please @Kerim Berdimyradov
          }
          {/* <Suspense
            fallback={<p className="bg-red-700">WIDGETS loading.....</p>}
          > */}
          <WidgetRenderer
            key={widget.id}
            twinId={twinId}
            widget={widget}
            className={cn(widget.styleClasses)}
          />
          {/* </Suspense> */}
        </div>
      );
    });
}
