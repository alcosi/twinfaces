import { Rss } from "lucide-react";

import { ChannelEvent } from "@/entities/notification";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { NotificationChannelEventResourceTooltip } from "./tooltip";

type Props = {
  data: ChannelEvent;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function NotificationChannelEventResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const link = `/${PlatformArea.core}/channel-event/${data.id}`;

  return (
    <ResourceLink
      IconComponent={Rss}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => (
              <NotificationChannelEventResourceTooltip
                data={data}
                link={link}
              />
            )
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.eventCode) ? data.eventCode : data.id!
      }
      link={link}
    />
  );
}
