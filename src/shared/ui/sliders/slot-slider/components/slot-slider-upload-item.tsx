import { UploadCloudIcon } from "lucide-react";

type Props = {
  onClick: () => void;
};

export function SlotSliderUploadItem({ onClick }: Props) {
  return (
    <div
      className="border-muted bg-muted/20 text-muted-foreground hover:bg-muted/40 flex h-full w-full cursor-pointer items-center justify-center border border-dashed"
      onClick={onClick}
    >
      <UploadCloudIcon className="h-6 w-6" />
    </div>
  );
}
