import { Link2 } from "lucide-react";

import { Link } from "@/entities/link";
import { isPopulatedString, isUndefined } from "@/shared/libs";
import { Badge, ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: Link;
  link: string;
};

export function LinkResourceTooltip({ data, link }: Props) {
  if (isUndefined(data.id)) return null;

  return (
    <ResourceLinkTooltip uuid={data.id} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={Link2}
      />

      <ResourceLinkTooltip.Main>
        <ResourceLinkTooltip.Item title="Type">
          <Badge variant="outline">{data.type}</Badge>
        </ResourceLinkTooltip.Item>
        <ResourceLinkTooltip.Item title="Strength">
          <Badge variant="outline">{data.linkStrengthId}</Badge>
        </ResourceLinkTooltip.Item>
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
