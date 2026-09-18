import { Zap } from "lucide-react";
import { ReactNode } from "react";

import { FactoryTrigger_DETAILED } from "@/entities/factory-trigger";
import { isPopulatedString, shortenUUID } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: FactoryTrigger_DETAILED;
  link: string;
  actions?: ReactNode;
};

export function FactoryTriggerResourceTooltip({ data, link, actions }: Props) {
  const title = isPopulatedString(data.id) ? shortenUUID(data.id) : "N/A";

  return (
    <ResourceLinkTooltip uuid={data.id!} link={link} actions={actions}>
      <ResourceLinkTooltip.Header
        title={title}
        subTitle={data.description}
        iconSource={Zap}
      />

      <ResourceLinkTooltip.Main>
        {data.factory?.name && (
          <ResourceLinkTooltip.Item title="Factory name">
            {data.factory?.name}
          </ResourceLinkTooltip.Item>
        )}

        {data.inputTwinClass?.name && (
          <ResourceLinkTooltip.Item title="Input class name">
            {data.inputTwinClass?.name}
          </ResourceLinkTooltip.Item>
        )}

        {data.async && (
          <ResourceLinkTooltip.Item title="Async">
            {String(data.async)}
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
