import { FC } from "react";

import { Face_DETAILED, fetchFaceById } from "@/entities/face";
import { cn, isPopulatedString, safe } from "@/shared/libs";

import { AlertError } from "../components";
import { TWidgetFaceProps, Widget, WidgetFaceProps } from "./types";
import { TW001, TW002, TW004, TW005, WT001 } from "./views";

const WIDGETS: Record<string, FC<WidgetFaceProps>> = {
  WT001,
};

const TWIDGETS: Record<string, FC<TWidgetFaceProps>> = {
  TW001,
  TW002,
  TW004,
  TW005,
};

type Props = {
  twinId?: string;
  widget: Widget;
  className?: string;
};

export async function WidgetRenderer({ twinId, widget, className }: Props) {
  const faceResult = await safe(() =>
    fetchFaceById<Face_DETAILED>(widget.widgetFaceId!, {
      query: { showFaceMode: "DETAILED" },
    })
  );

  if (!faceResult.ok) {
    return (
      <AlertError
        key={widget.widgetFaceId}
        title="Widget failed to load"
        message={(faceResult.error as Error)?.message}
      />
    );
  }

  const face = faceResult.data;
  const componentName = face.component;

  if (isPopulatedString(componentName) && componentName in WIDGETS) {
    const Comp = WIDGETS[componentName as keyof typeof WIDGETS]!;
    return <Comp face={face} widget={widget} />;
  }

  if (isPopulatedString(componentName) && componentName in TWIDGETS) {
    const Comp = TWIDGETS[componentName]!;

    if (!twinId) {
      return (
        <AlertError
          key={widget.widgetFaceId}
          title="Missing twinId"
          message={`Component "${componentName}" requires twinId but it was not provided.`}
        />
      );
    }

    return (
      <Comp twinId={twinId} face={face} widget={widget} className={className} />
    );
  }

  return (
    <AlertError
      key={widget.widgetFaceId}
      title="Unsupported widget"
      message={`Component "${componentName}" is not supported.`}
    />
  );
}
