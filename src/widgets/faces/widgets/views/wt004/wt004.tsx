import { fetchWT004Face, getAuthHeaders } from "@/entities/face";
import { fetchTwinById } from "@/entities/twin/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { MediaType } from "@/features/ui/sliders";
import { cn, safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { WT004Client } from "./wt004-client";

export async function WT004(props: WidgetFaceProps) {
  const { twinId, widget, className } = props;
  const header = await getAuthHeaders();
  const query = {
    showFaceWidget2TwinMode: "DETAILED",
    showAttachment2TwinMode: "DETAILED",
    showTwin2AttachmentCollectionMode: "ALL",
    showTwin2AttachmentMode: "DETAILED",
  } as const;

  const widgetResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchWT004Face(widget.widgetFaceId, twinId)
    )
  );

  if (!widgetResult.ok || !widgetResult.data.widget) {
    return (
      <StatusAlert variant="error" message="Widget WT004 failed to load." />
    );
  }
  const widgetConfig = widgetResult.data.widget;

  const twinResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchTwinById(widgetConfig.pointedTwinId!, { header, query })
    )
  );

  if (!twinResult.ok) {
    return <StatusAlert message="Failed to load twin." />;
  }
  const { twin } = twinResult.data;
  const allAttachments = twin.attachments ?? [];
  const relevantAttachments = widgetConfig.imagesTwinClassFieldId
    ? allAttachments.filter(
        (attachment) =>
          attachment.twinClassFieldId === widgetConfig.imagesTwinClassFieldId
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
    <div
      data-face-id={widgetConfig.id}
      className={cn("h-auto w-full max-w-[480px] object-contain", className)}
    >
      {widgetConfig.label && <p>{widgetConfig.label}</p>}
      <WT004Client
        items={typedMedia}
        twinId={widgetConfig.pointedTwinId!}
        options={{
          imagesTwinClassFieldId: widgetConfig.imagesTwinClassFieldId,
        }}
      />
    </div>
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
