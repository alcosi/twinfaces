import { SnowflakeIcon } from "lucide-react";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: TwinClass_DETAILED;
  link: string;
};

export function TwinClassFreezeResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        subTitle={data.key}
        iconSource={SnowflakeIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.key && (
          <ResourceLinkTooltip.Item title="Key">
            {data.key}
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
