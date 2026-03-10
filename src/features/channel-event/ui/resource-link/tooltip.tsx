import { Rss } from "lucide-react";

import { ChannelEvent } from "@/entities/recipient/index";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: ChannelEvent;
  link: string;
};

export function NotificationChannelEventResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.eventCode) ? data.eventCode : "N/A"}
        iconSource={Rss}
      />

      <ResourceLinkTooltip.Main>
        {data.id && (
          <ResourceLinkTooltip.Item title="Id">
            {data.id}
          </ResourceLinkTooltip.Item>
        )}
        {data.eventCode && (
          <ResourceLinkTooltip.Item title="Event code">
            {data.eventCode}
          </ResourceLinkTooltip.Item>
        )}
        {data.notificationChannelId && (
          <ResourceLinkTooltip.Item title="Channel Id">
            {data.notificationChannelId}
          </ResourceLinkTooltip.Item>
        )}
        {data.notificationContextId && (
          <ResourceLinkTooltip.Item title="Context Id">
            {data.notificationContextId}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
