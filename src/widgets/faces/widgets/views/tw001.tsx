import { fetchTW001Face, getAuthHeaders } from "@/entities/face";
import { fetchTwinById } from "@/entities/twin/server";
import { cn, safe } from "@/shared/libs";
import { SlotSlider } from "@/shared/ui";

import { AlertError } from "../../components";
import { widgetGridClasses } from "../../utils";
import { TWidgetFaceProps } from "../types";

export async function TW001(props: TWidgetFaceProps) {
  const { twinId, widget } = props;
  const header = await getAuthHeaders();
  const query = {
    showFaceTwidget2TwinMode: "DETAILED",
    showAttachment2TwinMode: "DETAILED",
    showTwin2AttachmentCollectionMode: "ALL",
    showTwin2AttachmentMode: "DETAILED",
  } as const;

  const twidgetResult = await safe(() =>
    fetchTW001Face(widget.widgetFaceId, twinId)
  );
  if (!twidgetResult.ok) {
    return <AlertError message="Widget TW001 failed to load." />;
  }
  const twidget = twidgetResult.data;

  const twinResult = await safe(() =>
    fetchTwinById(twidget.pointedTwinId!, { header, query })
  );
  if (!twinResult.ok) {
    return <AlertError message="Failed to load twin." />;
  }
  const twin = twinResult.data;
  const allAttachments = twin.attachments ?? [];
  const images = twidget.imagesTwinClassFieldId
    ? allAttachments.filter(
        (attachment) =>
          attachment.twinClassFieldId === twidget.imagesTwinClassFieldId
      )
    : allAttachments;

  return (
    <div className={cn("h-full max-w-[624px]", widgetGridClasses(widget))}>
      {twidget.label && <p>{twidget.label}</p>}
      <SlotSlider
        items={images.map((item) => ({
          id: item.id!,
          type: "image",
          url: item.storageLink!,
          title: item.title,
          content: item.title,
        }))}
      />
    </div>
  );
}
