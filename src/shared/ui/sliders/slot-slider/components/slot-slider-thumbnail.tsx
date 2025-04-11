import { MediaItem } from "../types";
import { ImageThumbnail } from "../views/image";
import { PdfThumbnail } from "../views/pdf";
import { UnknownThumbnail } from "../views/unknown";
import { VideoThumbnail } from "../views/video";

export function SlotSliderThumbnail({
  item,
  isActive,
}: {
  item: MediaItem & { type: string };
  isActive?: boolean;
}) {
  switch (item.type) {
    case "image":
      return (
        <ImageThumbnail src={item.url} alt={item.title} isActive={isActive} />
      );
    case "text":
      return <span>TODO</span>;
    case "video":
      return <VideoThumbnail src={item.url} isActive={isActive} />;
    case "pdf":
      return <PdfThumbnail title={item.title} isActive={isActive} />;
    default:
      return <UnknownThumbnail title={item.title} isActive={isActive} />;
  }
}
