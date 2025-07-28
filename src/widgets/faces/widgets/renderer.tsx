import { WidgetLoader } from "./loader";
import { Widget } from "./types";

type Props = {
  twinId?: string;
  widget: Widget;
  className?: string;
};

export function WidgetRenderer({ twinId, widget, className }: Props) {
  return <WidgetLoader twinId={twinId} widget={widget} className={className} />;
}
