import { Activity } from "lucide-react";

import { TwinFlowFactory_DETAILED } from "@/entities/twinflow-factory";
import { isPopulatedString, shortenUUID } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: TwinFlowFactory_DETAILED;
  link: string;
};

export function TwinFlowFactoryResourceTooltip({ data, link }: Props) {
  const title = isPopulatedString(data.id) ? shortenUUID(data.id) : "N/A";

  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={title}
        subTitle={data.twinFactoryLauncherId}
        iconSource={Activity}
      />

      <ResourceLinkTooltip.Main>
        {data.twinflow?.name && (
          <ResourceLinkTooltip.Item title="Twinflow">
            {data.twinflow.name}
          </ResourceLinkTooltip.Item>
        )}

        {data.factory?.name && (
          <ResourceLinkTooltip.Item title="Factory">
            {data.factory.name}
          </ResourceLinkTooltip.Item>
        )}

        {data.twinFactoryLauncherId && (
          <ResourceLinkTooltip.Item title="Launcher">
            {data.twinFactoryLauncherId}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
