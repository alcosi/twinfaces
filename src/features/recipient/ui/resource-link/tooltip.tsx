import { Megaphone } from "lucide-react";

import { Recipient } from "@/entities/notification/index";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: Recipient;
  link: string;
};

export function RecipientResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={Megaphone}
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
        {data.createdAt && (
          <ResourceLinkTooltip.Item title="CreatedAt">
            {data.createdAt}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
