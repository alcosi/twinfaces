import { Separator } from "@/components/base/separator";
import { TwinClass } from "@/lib/api/api-types";
import { Check, Clock, Copy, LayoutTemplate, Link } from "lucide-react";
import { toast } from "sonner";

type Props = {
    data: TwinClass;
}

export const TwinClassResourceTooltip = ({ data }: Props) => {
  return (
    <div className="p-2 text-sm">
      <div className="space-y-1">
        <div className="flex flex-row gap-2 items-center">
          <LayoutTemplate className="h-4 w-4" />
          {data.name ? data.name : data.key ?? "N/A"}
          {data.abstractClass && <Check className="h-4 w-4" />}
        </div>
        {data.description && <p>{data.description}</p>}
        {data.extendsClass && (
          <div>
            <strong>Extends: </strong>
            {data.extendsClass.key}
          </div>
        )}
        {data.headClassId && (
          <div>
            <strong>Head Class ID: </strong>
            {data.headClassId}
          </div>
        )}
        {data.createdAt && (
          <div className="flex flex-row gap-2 items-center">
            <Clock className="h-4 w-4" />
            {new Date(data.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>

      <Separator className="my-2" />

      <button
        className="flex flex-row gap-2 items-center hover:bg-secondary w-full p-0.5"
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(data.id ?? "").then(() => {
            toast.message("UUID is copied");
          });
        }}
      >
        <Copy className="h-4 w-4" />
        Copy UUID
      </button>
      <button
        className="flex flex-row gap-2 items-center hover:bg-secondary w-full p-0.5"
        onClick={(e) => {
          e.stopPropagation();
          const baseUrl =
            typeof window !== "undefined" ? window.location.origin : "";
          const link = `${baseUrl}/twinclass/${data.id}`;

          navigator.clipboard.writeText(link).then(() => {
            toast.message("Link is copied");
          });
        }}
      >
        <Link className="h-4 w-4" />
        Copy Link
      </button>
    </div>
  );
};
