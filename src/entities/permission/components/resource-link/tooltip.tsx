import { Button } from "@/components/base/button";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { isFullString, stopPropagation } from "@/shared/libs";
import { Copy, Key, Link } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Permission } from "../../api";

type Props = {
  data: Permission;
};

export function PermissionResourceTooltip({ data }: Props) {
  function handleCopyUUID(e: React.MouseEvent) {
    stopPropagation(e);
    navigator.clipboard.writeText(data.id ?? "").then(() => {
      toast.message("UUID is copied");
    });
  }

  function handleCopyLink(e: React.MouseEvent) {
    stopPropagation(e);
    const baseUrl = window?.location.origin ?? "";
    const link = `${baseUrl}/permission/${data.id}`;

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
        <div className="h-24 w-24 rounded-full bg-muted text-link-light-active dark:text-link-dark-active flex shrink-0 justify-center items-center">
          <Key className="h-16 w-16" />
        </div>

        <div className="flex flex-col justify-end h-16 overflow-hidden">
          <div className="font-semibold text-lg truncate whitespace-nowrap">
            {isFullString(data.name) ? data.name : "N/A"}
          </div>
          <div className="text-sm truncate whitespace-nowrap">{data.key}</div>
        </div>
      </header>

      <main className="space-y-2 text-base">
        {data.groupId && (
          <div className="flex flex-row gap-2 items-center">
            <strong>Group Id:</strong>
            <ShortGuidWithCopy value={data.groupId} disableTooltip />
          </div>
        )}
      </main>

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
