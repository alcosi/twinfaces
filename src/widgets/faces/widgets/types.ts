import { Face_DETAILED } from "@/entities/face";
import { RequireFields } from "@/shared/libs";

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
  twinId?: string;
};

export type TWidgetFaceProps = RequireFields<WidgetFaceProps, "twinId">;
