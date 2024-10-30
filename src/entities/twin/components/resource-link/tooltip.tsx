import { Button } from "@/components/base/button";
import { TwinClassStatusResourceLink } from "@/entities/twinClassStatus";
import { UserResourceLink } from "@/entities/user";
import { isFullString, stopPropagation } from "@/shared/libs";
import { Braces, Copy, Link } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { TwinBase } from "../../api";

type Props = {
  data: TwinBase;
  withTooltip?: boolean;
};

export function TwinResourceTooltip({ data }: Props) {
  function handleCopyUUID(e: React.MouseEvent) {
    stopPropagation(e);
    navigator.clipboard.writeText(data.id ?? "").then(() => {
      toast.message("UUID is copied");
    });
  }

  function handleCopyLink(e: React.MouseEvent) {
    stopPropagation(e);
    const baseUrl = window?.location.origin ?? "";
    const link = `${baseUrl}/twin/${data.id}`;

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
          <Braces className="w-16 h-16" />
        </div>

        <div className="flex flex-col justify-end h-16">
          <div className="font-semibold text-lg">
            {isFullString(data.name) ? data.name : "N/A"}
          </div>
        </div>
      </header>

      <main className="space-y-2 text-base">
        {data.description && <p>{data.description}</p>}

        {data.status && (
          <div className="flex gap-2">
            <strong>Status:</strong>
            <TwinClassStatusResourceLink data={data.status} />
          </div>
        )}

        {data.authorUser && (
          <div className="flex gap-2">
            <strong>Author:</strong>
            <UserResourceLink data={data.authorUser} />
          </div>
        )}

        {data.assignerUser && (
          <div className="flex gap-2">
            <strong>Assigner:</strong>
            <UserResourceLink data={data.assignerUser} />
          </div>
        )}

        {data.createdAt && (
          <div className="flex flex-row gap-2 items-center">
            <strong>Created at:</strong>
            {new Date(data.createdAt).toLocaleDateString()}
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
