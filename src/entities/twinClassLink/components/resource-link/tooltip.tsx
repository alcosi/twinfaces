import { TwinClassLink } from "@/entities/twinClassLink";
import { isPopulatedString, isUndefined } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { Link2 } from "lucide-react";

type Props = {
  data: TwinClassLink;
  link: string;
};

export function TwinClassLinkResourceTooltip({ data, link }: Props) {
  if (isUndefined(data.id)) return null;

  return (
    <ResourceLinkTooltip uuid={data.id} link={link}>
      <ResourceLinkTooltip.Header iconSource={Link2}>
        <div className="font-semibold text-lg">
          {isPopulatedString(data.name) ? data.name : "N/A"}
        </div>
      </ResourceLinkTooltip.Header>
    </ResourceLinkTooltip>
  );
}
