import { Badge } from "@/components/base/badge";
import { Separator } from "@/components/base/separator";
import { TwinClassLink } from "@/lib/api/api-types";
import { Copy, Link, Link2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
  data: TwinClassLink;
  twinClassId: string;
};

export function TwinClassLinkResourceTooltip({ data, twinClassId }: Props) {
  const handleCopyUUID = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(data.id ?? "").then(() => {
      toast.message("UUID is copied");
    });
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const baseUrl = window?.location.origin ?? "";
    const link = `${baseUrl}/twinclass/${twinClassId}/link/${data.id}`;

    navigator.clipboard.writeText(link).then(() => {
      toast.message("Link is copied");
    });
  };

  return (
    <>
      <div className="space-y-1">
        <div className="flex flex-row gap-2 items-center">
          <Link2 className="h-4 w-4" />
          {data.name}
        </div>
        {data.type && (
          <div>
            <strong>Type: </strong>
            <Badge variant="outline">{data.type}</Badge>
          </div>
        )}
        {data.linkStrengthId && (
          <div>
            <strong>Link Strength: </strong>
            <Badge variant="outline">{data.linkStrengthId}</Badge>
          </div>
        )}
      </div>

      <Separator className="my-2" />

      <button
        className="flex flex-row gap-2 items-center hover:bg-secondary w-full p-0.5"
        onClick={handleCopyUUID}
      >
        <Copy className="h-4 w-4" />
        Copy UUID
      </button>
      <button
        className="flex flex-row gap-2 items-center hover:bg-secondary w-full p-0.5"
        onClick={handleCopyLink}
      >
        <Link className="h-4 w-4" />
        Copy Link
      </button>
    </>
  );
}
