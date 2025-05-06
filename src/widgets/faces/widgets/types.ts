import { Face_DETAILED } from "@/entities/face";

export type Widget = {
  id: string;
  styleClasses?: string[];
  column?: number;
  columnEnd?: number;
  columnSpan?: number;
  row?: number;
  rowEnd?: number;
  rowSpan?: number;
  active?: boolean;
  widgetFaceId: string;
};

export type WidgetFaceProps = {
  face: Face_DETAILED;
  widget: Widget;
  className?: string;
};

export type TWidgetFaceProps = WidgetFaceProps & {
  twinId: string;
};
