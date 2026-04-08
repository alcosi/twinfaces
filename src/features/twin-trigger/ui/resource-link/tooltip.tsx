import { Wand } from "lucide-react";

import { TwinTrigger } from "@/entities/twin-trigger";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: TwinTrigger;
  link: string;
};

export function TwinTriggerResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={Wand}
      />

      <ResourceLinkTooltip.Main>
        {data.id && (
          <ResourceLinkTooltip.Item title="Id">
            {data.id}
          </ResourceLinkTooltip.Item>
        )}
        {data.name && (
          <ResourceLinkTooltip.Item title="Name">
            {data.name}
          </ResourceLinkTooltip.Item>
        )}
        {data.description && (
          <ResourceLinkTooltip.Item title="Description">
            {data.description}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
