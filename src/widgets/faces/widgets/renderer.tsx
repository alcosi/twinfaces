import { FC, Suspense } from "react";

import { Face_DETAILED, fetchFaceById } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import {
  AlertSkeleton,
  CarouselSkeleton,
  TableSkeleton,
  ThumbnailsSkeleton,
  WidgetItemSkeleton,
} from "@/features/ui/skeletons";
import { isPopulatedString, isUndefined, safe } from "@/shared/libs";
import { Skeleton } from "@/shared/ui";

import { StatusAlert } from "../components";
import { Widget, WidgetFaceProps } from "./types";
import {
  WT001,
  WT002,
  WT003,
  WT004,
  WT005,
  WT006,
  WT007,
  WT008,
  WT010,
  WT011,
} from "./views";

type Props = {
  twinId?: string;
  widget: Widget;
  className?: string;
};

const WIDGETS: Record<string, FC<WidgetFaceProps>> = {
  WT001,
  WT002,
  WT003,
  WT004,
  WT005,
  WT006,
  WT007,
  WT008,
  WT010,
  WT011,
};

const WIDGET_SKELETONS: Record<keyof typeof WIDGETS, FC> = {
  WT001: () => <TableSkeleton />,
  WT002: () => <Skeleton className="h-10 w-20 rounded-md" />,
  WT003: () => <AlertSkeleton />,
  WT004: () => (
    <>
      <CarouselSkeleton />
      <ThumbnailsSkeleton />
    </>
  ),
  WT005: () => <Skeleton className="h-36 w-full" />,
  WT006: () => <WidgetItemSkeleton />,
  WT007: () => <Skeleton className="h-10 w-20 rounded-md" />,
  WT008: () => <Skeleton className="h-40 w-full rounded-lg" />,
  WT010: () => <Skeleton className="h-10 w-20 rounded-md" />,
  WT011: () => <Skeleton className="h-64 w-full rounded-lg" />,
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
  const Skeleton = WIDGET_SKELETONS[componentName as keyof typeof WIDGETS];
  const fallback = Skeleton ? <Skeleton /> : null;

  if (isPopulatedString(componentName) && componentName in WIDGETS) {
    if (isUndefined(twinId)) {
      return (
        <StatusAlert
          key={widget.widgetFaceId}
          title="Missing twinId"
          message={`Component "${componentName}" requires twinId but was not provided.`}
        />
      );
    }

    const WidgetComp = WIDGETS[componentName]!;

    return (
      <Suspense fallback={fallback}>
        <WidgetComp
          face={face}
          widget={widget}
          twinId={twinId}
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
