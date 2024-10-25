import { Button } from "@/components/base/button";
import { TwinClassLink } from "@/lib/api/api-types";
import { isFullString } from "@/shared/libs/helpers";
import { Copy, Link, Link2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
  data: TwinClassLink;
  twinClassId: string;
};

const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

export function TwinClassLinkResourceTooltip({ data, twinClassId }: Props) {
  function handleCopyUUID(e: React.MouseEvent) {
    stopPropagation(e);
    navigator.clipboard.writeText(data.id ?? "").then(() => {
      toast.message("UUID is copied");
    });
  }

  function handleCopyLink(e: React.MouseEvent) {
    stopPropagation(e);
    const baseUrl = window?.location.origin ?? "";
    const link = `${baseUrl}/twinclass/${twinClassId}/link/${data.id}`;

    navigator.clipboard.writeText(link).then(() => {
      toast.message("Link is copied");
    });
  }

  return (
    <div
      className="text-sm w-96 p-6 space-y-4"
      onClick={stopPropagation}
      style={{
        background:
          "linear-gradient(to bottom, #3b82f6 96px, transparent 96px)",
      }}
    >
      <header className="flex h-24 gap-x-4 text-primary-foreground">
        <div className="h-24 w-24 rounded-full bg-muted text-link-light-active dark:text-link-dark-active flex justify-center items-center">
          <Link2 className="w-16 h-16" />
        </div>

        <div className="flex flex-col justify-end h-16">
          <div className="font-semibold text-lg">
            {isFullString(data.name) ? data.name : "N/A"}
          </div>
        </div>
      </header>

      <footer className="flex gap-x-2 justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex flex-row gap-2 items-center hover:bg-secondary w-full p-0.5"
          onClick={handleCopyUUID}
        >
          <Copy className="h-4 w-4" />
          Copy UUID
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex flex-row gap-2 items-center hover:bg-secondary w-full p-0.5"
          onClick={handleCopyLink}
        >
          <Link className="h-4 w-4" />
          Copy Link
        </Button>
      </footer>
    </div>
  );
}
