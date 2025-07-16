import { MediaItem } from "../types";
import { ImageSlide } from "../views/image";
import { PdfSlide } from "../views/pdf";
import { UnknownSlide } from "../views/unknown";
import { VideoSlide } from "../views/video";

export function SlotSliderItem({
  item,
}: {
  item: MediaItem & { type: string };
}) {
  switch (item.type) {
    case "image":
      return (
        <ImageSlide src={item.url} alt={item.title} caption={item.title} />
      );
    case "text":
      return <span>TODO</span>;
    case "video":
      return <VideoSlide src={item.url} title={item.title} />;
    case "pdf":
      return <PdfSlide url={item.url} title={item.title} />;
    default:
      return <UnknownSlide title={item.title} />;
  }
}
