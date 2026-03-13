import { BellRing } from "lucide-react";

import { NotificationSchema } from "@/entities/notification/index";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: NotificationSchema;
  link: string;
};

export function NotificationSchemaResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={BellRing}
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
