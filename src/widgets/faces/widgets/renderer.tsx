import { FC } from "react";

import { Face_DETAILED, fetchFaceById } from "@/entities/face";
import { isPopulatedString, safe } from "@/shared/libs";

import { AlertError } from "../alert-error";
import { TWidgetProps, WidgetProps } from "./types";
import { TW001, TW002, WT001 } from "./views";

const WIDGETS: Record<string, FC<WidgetProps>> = {
  WT001,
};

const TWIDGETS: Record<string, FC<Required<TWidgetProps>>> = {
  TW001,
  TW002,
};

export async function WidgetRenderer(props: WidgetProps) {
  const result = await safe(() =>
    fetchFaceById<Face_DETAILED>(props.widgetFaceId, {
      query: { showFaceMode: "DETAILED" },
    })
  );

  if (!result.ok) {
    return (
      <AlertError
        key={props.widgetFaceId}
        title="Widget failed to load"
        message={(result.error as Error)?.message}
      />
    );
  }

  const face = result.data;
  const componentName = face.component;

  if (isPopulatedString(componentName) && componentName in WIDGETS) {
    const Comp = WIDGETS[componentName as keyof typeof WIDGETS]!;
    return <Comp {...props} />;
  }

  if (isPopulatedString(componentName) && componentName in TWIDGETS) {
    const Comp = TWIDGETS[componentName]!;

    if (!props.twinId) {
      return (
        <AlertError
          key={props.widgetFaceId}
          title="Missing twinId"
          message={`Component "${componentName}" requires twinId but it was not provided.`}
        />
      );
    }

    return <Comp {...(props as Required<TWidgetProps>)} />;
  }

  return (
    <AlertError
      key={props.widgetFaceId}
      title="Unsupported widget"
      message={`Component "${componentName}" is not supported.`}
    />
  );
}
