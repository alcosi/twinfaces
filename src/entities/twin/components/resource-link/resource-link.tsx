import { ResourceLink } from "@/shared/ui";
import { Braces, Copy, Link } from "lucide-react";
import { toast } from "sonner";

type Props = {
    data: {
        id?: string;
    };
    withTooltip?: boolean;
}

const TwinResourceTooltip = ({ data }: Props) => {

    return (
      <div>
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
            const link = `${baseUrl}/twin/${data.id}`;

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
}

export const TwinResourceLink = ({ data, withTooltip }: Props) => {
    return (
      <ResourceLink
        icon={<Braces />}
        data={data}
        renderTooltip={withTooltip
            ? (data) => <TwinResourceTooltip data={data} />
            : undefined
        }
        getDisplayName={(data) => data.id ?? ""}
        getLink={(data) => `/twin/${data.id}`}
      />
    );
}