import { Suspense } from "react";

import { fetchTW001Face, getAuthHeaders } from "@/entities/face";
import { fetchTwinById } from "@/entities/twin/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { cn, safe } from "@/shared/libs";
import { MediaType, SlotSlider } from "@/shared/ui";
import { SlotSliderPlaceholder } from "@/shared/ui/sliders/slot-slider/components/slot-slider-placeholder";

import { StatusAlert } from "../../../components";
import { TWidgetFaceProps } from "../../types";

export async function TW001(props: TWidgetFaceProps) {
  const { twinId, widget, className } = props;
  const header = await getAuthHeaders();
  const query = {
    showFaceTwidget2TwinMode: "DETAILED",
    showAttachment2TwinMode: "DETAILED",
    showTwin2AttachmentCollectionMode: "ALL",
    showTwin2AttachmentMode: "DETAILED",
  } as const;

  const twidgetResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchTW001Face(widget.widgetFaceId, twinId)
    )
  );
  if (!twidgetResult.ok || !twidgetResult.data.widget) {
    return (
      <StatusAlert variant="error" message="Widget TW001 failed to load." />
    );
  }
  const twidget = twidgetResult.data.widget;

  const twinResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchTwinById(twidget.pointedTwinId!, { header, query })
    )
  );
  if (!twinResult.ok) {
    return <StatusAlert message="Failed to load twin." />;
  }
  const twin = twinResult.data;
  const allAttachments = twin.attachments ?? [];
  const relevantAttachments = twidget.imagesTwinClassFieldId
    ? allAttachments.filter(
        (attachment) =>
          attachment.twinClassFieldId === twidget.imagesTwinClassFieldId
      )
    : allAttachments;

  const typedMedia = await Promise.all(
    relevantAttachments.map(async (item) => ({
      id: item.id!,
      url: item.storageLink!,
      title: item.title,
      content: item.title,
      type: await detectFileType(item.storageLink!),
    }))
  );

  return (
    // NOTE fallback doesn't work here either, all fallbacks need to be done in the WidgetsContainer component
    <Suspense fallback={<SlotSliderPlaceholder />}>
      <div
        data-face-id={twidget.id}
        className={cn("h-auto w-full max-w-[480px] object-contain", className)}
      >
        {twidget.label && <p>{twidget.label}</p>}
        <SlotSlider items={typedMedia} />
      </div>
    </Suspense>
  );
}

// === Utils ===

async function detectFileType(url: string): Promise<MediaType> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const mime = res.headers.get("Content-Type") || "";
    return inferTypeFromMime(mime);
  } catch (e) {
    console.error("Failed to detect file type via HEAD request:", e);
    return "unknown";
  }
}

function inferTypeFromMime(mime: string): MediaType {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime === "application/pdf") return "pdf";
  if (mime.startsWith("text/")) return "text";
  return "unknown";
}
