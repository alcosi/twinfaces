import Image from "next/image";

import { fetchTW001Face, getAuthHeaders } from "@/entities/face";
import { fetchTwinById } from "@/entities/twin/server";
import { cn, safe } from "@/shared/libs";
import {
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui";

import { AlertError } from "../../alert-error";
import { widgetGridClasses } from "../../layouts/utils";
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
    <div className={cn("max-w-[624px] h-full", widgetGridClasses(widget))}>
      {twidget.label && <p>{twidget.label}</p>}
      <Carousel className="w-full max-w-full">
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-0">
                  <div className="relative w-full h-full">
                    <Image
                      fill
                      src={image.storageLink!}
                      alt={image.title!}
                      className="rounded-lg object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-4 mt-4 relative z-10">
          <CarouselPrevious className="static mt-2" />
          <CarouselNext className="static mt-2" />
        </div>
      </Carousel>
    </div>
  );
}
