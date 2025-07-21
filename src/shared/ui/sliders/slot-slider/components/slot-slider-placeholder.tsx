import { NoImageIcon } from "@/shared/ui/icons";

import { SlotSliderUploadItem } from "./slot-slider-upload-item";

export function SlotSliderPlaceholder({ twinId }: { twinId: string }) {
  return (
    <>
      <div className="border-border text-muted-foreground mb-2 flex min-h-96 w-full flex-col items-center justify-center rounded-md border border-dashed p-4">
        <div className="mb-2 text-4xl">
          <NoImageIcon className="h-14 w-14" />
        </div>
        <p className="text-sm">No media found</p>
      </div>
      <div className="text-muted-foreground mt-2 flex w-full items-center justify-between gap-4">
        <div className="border-border flex h-10 w-10 items-center justify-center rounded-full border border-dashed text-center" />

        <div className="border-border flex h-20 w-20 items-center justify-center rounded-md border border-dashed">
          <NoImageIcon className="h-6 w-6" />
        </div>
        <div className="border-border flex h-20 w-20 items-center justify-center rounded-md border border-dashed">
          <NoImageIcon className="h-6 w-6" />
        </div>
        <div className="border-border flex h-20 w-20 items-center justify-center rounded-md border border-dashed">
          <SlotSliderUploadItem twinId={twinId} />
        </div>

        <div className="border-border flex h-10 w-10 items-center justify-center rounded-full border border-dashed text-center" />
      </div>
    </>
  );
}
