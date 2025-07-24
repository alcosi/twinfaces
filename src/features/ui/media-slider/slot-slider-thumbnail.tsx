import { MediaItem } from "@/shared/ui/sliders/slot-slider/types";
import { ImageThumbnail } from "@/shared/ui/sliders/slot-slider/views/image";
import { PdfThumbnail } from "@/shared/ui/sliders/slot-slider/views/pdf";
import { UnknownThumbnail } from "@/shared/ui/sliders/slot-slider/views/unknown";
import { VideoThumbnail } from "@/shared/ui/sliders/slot-slider/views/video";

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
