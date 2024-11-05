import { Button } from "@/components/base/button";
import { isPopulatedString, stopPropagation } from "@/shared/libs";
import { Avatar } from "@/shared/ui";
import { Check, Copy, LayoutTemplate, Link, X } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { TwinClass_DETAILED } from "../../libs";
import { TwinClassResourceLink } from "./resource-link";

type Props = {
  data: TwinClass_DETAILED;
};

export const TwinClassResourceTooltip = ({ data }: Props) => {
  function handleCopyUUID(e: React.MouseEvent) {
    stopPropagation(e);
    navigator.clipboard.writeText(data.id ?? "").then(() => {
      toast.message("UUID is copied");
    });
  }

  function handleCopyLink(e: React.MouseEvent) {
    stopPropagation(e);
    const baseUrl = window?.location.origin ?? "";
    const link = `${baseUrl}/twinclass/${data.id}`;

    navigator.clipboard.writeText(link).then(() => {
      toast.message("Link is copied");
    });
  }

  return (
    <div
      className="text-sm w-96 p-6 space-y-4"
      onClick={stopPropagation}
      // TODO: refactor
      style={{
        background:
          "linear-gradient(to bottom, #3b82f6 96px, transparent 96px)",
      }}
    >
      <header className="flex h-24 gap-x-4 text-primary-foreground">
        <div className="h-24 w-24 rounded-full bg-muted text-link-light-active dark:text-link-dark-active flex justify-center items-center">
          {data.logo ? (
            <Avatar url={data.logo} alt={data.name ?? "Logo"} size="xlg" />
          ) : (
            <LayoutTemplate className="w-16 h-16" />
          )}
        </div>

        <div className="flex flex-col justify-end h-16">
          <div className="font-semibold text-lg">
            {isPopulatedString(data.name) ? data.name : "N/A"}
          </div>
          <div className="text-sm">{data.key}</div>
        </div>
      </header>

      <main className="space-y-2 text-base">
        {data.description && <p>{data.description}</p>}
        <div className="flex flex-row gap-2 items-center font-semibold">
          <strong>Abstract: </strong>
          {data.abstractClass ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </div>
        {/* // TODO: re-thinkg typing approach here (maybe use type guard) */}
        {data.extendsClass?.key && (
          <div className="flex gap-2">
            <strong>Extends:</strong>
            <TwinClassResourceLink
              data={data.extendsClass as TwinClass_DETAILED}
            />
          </div>
        )}
        {/* // TODO: re-thinkg typing approach here (maybe use type guard) */}
        {data.headClass?.key && (
          <div className="flex gap-2">
            <strong>Head:</strong>
            <TwinClassResourceLink
              data={data.headClass as TwinClass_DETAILED}
            />
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
};
