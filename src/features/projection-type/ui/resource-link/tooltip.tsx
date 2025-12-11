import { Shuffle } from "lucide-react";

import { ProjectionType } from "@/entities/projection";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: ProjectionType;
  link: string;
};

export function ProjectionTypeResourceTooltip({ data, link }: Props) {
  const title = isPopulatedString(data.name) ? data.name : "N/A";

  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header title={title} iconSource={Shuffle} />

      <ResourceLinkTooltip.Main>
        {data.name && (
          <ResourceLinkTooltip.Item title="Name">
            {data.name}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
