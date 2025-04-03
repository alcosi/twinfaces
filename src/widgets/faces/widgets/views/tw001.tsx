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

  // TODO:
  // Extract thumbnails into a separate component,
  // Add keyboard / swipe navigation,
  // Auto-play support,
  // Or convert to a generic slider with slot-based customization.
  // Make aspectRatio customizable,
  // Handle zoom or full-screen image viewer.
  // Add support for audio or PDFs
  // Extract it as a reusable package
  // ✅ Add support for captions,
  return (
    <div className={cn("max-w-[624px] h-full", widgetGridClasses(widget))}>
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
