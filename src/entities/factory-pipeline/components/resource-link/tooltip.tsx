import { isPopulatedString, shortenUUID } from "@/shared/libs";
import { FactoryPipeline } from "../../api";
import { ResourceLinkTooltip } from "@/shared/ui";
import { FenceIcon } from "lucide-react";

type Props = {
  data: FactoryPipeline;
  link: string;
};

export function FactoryPipelineResourceTooltip({ data, link }: Props) {
  const title = isPopulatedString(data.id) ? shortenUUID(data.id) : "N/A";

  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={title}
        subTitle={data.description}
        iconSource={FenceIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.inputTwinClass?.name && (
          <ResourceLinkTooltip.Item title="Input class name">
            {data.inputTwinClass?.name}
          </ResourceLinkTooltip.Item>
        )}

        {data.factoryConditionSet?.name && (
          <ResourceLinkTooltip.Item title="Condition set name">
            {data.factoryConditionSet?.name}
          </ResourceLinkTooltip.Item>
        )}

        {data.active && (
          <ResourceLinkTooltip.Item title="Active">
            {data.active.valueOf().toString()}
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
