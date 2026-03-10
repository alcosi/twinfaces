import { Rss } from "lucide-react";

import { ChannelEvent } from "@/entities/recipient/index";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { ChannelEventResourceTooltip } from "./tooltip";

type Props = {
  data: ChannelEvent;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function ChannelEventResourceLink({
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
          ? (data) => <ChannelEventResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.eventCode) ? data.eventCode : data.id!
      }
      link={link}
    />
  );
}
