import { FC, Suspense } from "react";

import { Face_DETAILED, fetchFaceById } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import {
  AlertSkeleton,
  ButtonSkeleton,
  CarouselSkeleton,
  TableSkeleton,
  ThumbnailsSkeleton,
  TwidgetItem,
} from "@/features/ui/skeletons";
import { isPopulatedString, safe } from "@/shared/libs";

import { StatusAlert } from "../components";
import { TWidgetFaceProps, Widget, WidgetFaceProps } from "./types";
import { TW001, TW002, TW004, TW005, WT001, WT002, WT003 } from "./views";

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

const WIDGET_SKELETONS: Record<string, FC> = {
  WT001: () => <TableSkeleton />,
  WT002: () => <ButtonSkeleton />,
  WT003: () => <AlertSkeleton />,
  TW001: () => (
    <>
      <CarouselSkeleton />
      <ThumbnailsSkeleton />
    </>
  ),
  TW002: () => (
    <div className="h-36 w-full animate-pulse rounded bg-gray-200" />
  ),
  TW004: () => <TwidgetItem />,
  TW005: () => <ButtonSkeleton />,
};

type Props = {
  twinId?: string;
  widget: Widget;
  className?: string;
};

export async function WidgetLoader({ twinId, widget, className }: Props) {
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
    const WidgetComp = WIDGETS[componentName as keyof typeof WIDGETS];

    if (!WidgetComp) {
      return (
        <StatusAlert
          variant="warn"
          title="Widget missing"
          message={`Component "${componentName}" was not found in WIDGETS map.`}
        />
      );
    }
    return (
      <Suspense fallback={fallback}>
        <WidgetComp face={face} widget={widget} twinId={twinId} />
      </Suspense>
    );
  }

  if (isPopulatedString(componentName) && componentName in TWIDGETS) {
    const TWidgetComp = TWIDGETS[componentName as keyof typeof TWIDGETS];

    if (!TWidgetComp) {
      return (
        <StatusAlert
          variant="warn"
          title="Widget missing"
          message={`Component "${componentName}" was not found in TWIDGETS map.`}
        />
      );
    }

    if (!twinId) {
      return (
        <StatusAlert
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
      variant="warn"
      title="Unsupported widget"
      message={`Component "${componentName}" is not supported.`}
    />
  );
}
