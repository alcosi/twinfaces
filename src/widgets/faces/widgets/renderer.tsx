import { FC, Suspense } from "react";

import { Face_DETAILED, fetchFaceById } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import {
  AlertSkeleton,
  CarouselSkeleton,
  TableSkeleton,
  ThumbnailsSkeleton,
  TwidgetItem,
} from "@/features/ui/skeletons";
import { isPopulatedString, safe } from "@/shared/libs";
import { Skeleton } from "@/shared/ui";

import { StatusAlert } from "../components";
import { TWidgetFaceProps, Widget, WidgetFaceProps } from "./types";
import { TW001, TW002, TW004, TW005, WT001, WT002, WT003 } from "./views";

type Props = {
  twinId?: string;
  widget: Widget;
  className?: string;
};

const WIDGETS: Record<string, FC<WidgetFaceProps>> = {
  WT001,
  WT002,
  WT003,
};

const TWIDGETS: Record<string, FC<TWidgetFaceProps>> = {
  TW001,
  TW002,
  TW004,
  TW005,
};

const WIDGET_SKELETONS: Record<
  keyof typeof WIDGETS & keyof typeof TWIDGETS,
  FC
> = {
  WT001: () => <TableSkeleton />,
  WT002: () => <Skeleton className="h-10 w-20 rounded-md" />,
  WT003: () => <AlertSkeleton />,
  TW001: () => (
    <>
      <CarouselSkeleton />
      <ThumbnailsSkeleton />
    </>
  ),
  TW002: () => <Skeleton className="h-36 w-full" />,
  TW004: () => <TwidgetItem />,
  TW005: () => <Skeleton className="h-10 w-20 rounded-md" />,
};

export async function WidgetRenderer({ twinId, widget, className }: Props) {
  const faceResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchFaceById<Face_DETAILED>(widget.widgetFaceId, {
        query: { showFaceMode: "DETAILED" },
      })
    )
  );

  if (!faceResult.ok) {
    return (
      <StatusAlert
        key={widget.widgetFaceId}
        variant="error"
        title="Widget failed to load"
        message={(faceResult.error as Error)?.message}
      />
    );
  }

  const face = faceResult.data;
  const componentName = face.component;
  const Skeleton = WIDGET_SKELETONS[componentName];
  const fallback = Skeleton ? <Skeleton /> : null;

  if (isPopulatedString(componentName) && componentName in WIDGETS) {
    const WidgetComp = WIDGETS[componentName as keyof typeof WIDGETS]!;

    return (
      <Suspense fallback={fallback}>
        <WidgetComp face={face} widget={widget} twinId={twinId} />
      </Suspense>
    );
  }

  if (isPopulatedString(componentName) && componentName in TWIDGETS) {
    const TWidgetComp = TWIDGETS[componentName as keyof typeof TWIDGETS]!;

    if (!twinId) {
      return (
        <StatusAlert
          key={widget.widgetFaceId}
          title="Missing twinId"
          message={`Component "${componentName}" requires twinId but was not provided.`}
        />
      );
    }

    return (
      <Suspense fallback={fallback}>
        <TWidgetComp
          twinId={twinId}
          face={face}
          widget={widget}
          className={className}
        />
      </Suspense>
    );
  }

  return (
    <StatusAlert
      key={widget.widgetFaceId}
      variant="warn"
      title="Unsupported widget"
      message={`Component "${componentName}" is not supported.`}
    />
  );
}
