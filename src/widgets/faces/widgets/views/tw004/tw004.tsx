import { fetchTW004Face, getAuthHeaders } from "@/entities/face";
import { cn, safe } from "@/shared/libs";

import { AlertError } from "../../../components";
import { widgetGridClasses } from "../../../utils";
import { TWidgetFaceProps } from "../../types";
import { TW004Client } from "./tw004-client";

export async function TW004(props: TWidgetFaceProps) {
  const { twinId, widget } = props;

  const twidgetResult = await safe(() =>
    fetchTW004Face(widget.widgetFaceId, twinId)
  );
  if (!twidgetResult.ok) {
    return <AlertError message="Widget TW001 failed to load." />;
  }
  const twidget = twidgetResult.data;

  console.log("foobar twidget", twidget);

  //   const twinResult = await safe(() =>
  //     fetchTwinById(twidget.pointedTwinId!, { header, query })
  //   );

  //   if (!twinResult.ok) {
  //     return <AlertError message="Failed to load twin." />;
  //   }

  //   const twin = twinResult.data;

  return (
    <div className={cn("max-w-[624px] h-full", widgetGridClasses(widget))}>
      <TW004Client label={twidget.label} />
      {/* {twidget.label && <p>{twidget.label}</p>}
      {twidget.name && <p>{twidget.name}</p>} */}
      {/* <p>{JSON.stringify(twidget)}</p> */}
    </div>
  );
}
