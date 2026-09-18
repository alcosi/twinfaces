import { SquareAsterisk } from "lucide-react";
import { ReactNode } from "react";

import { FactoryMultiplierFilter_DETAILED } from "@/entities/factory-multiplier-filter";
import { isPopulatedString, shortenUUID } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: FactoryMultiplierFilter_DETAILED;
  link: string;
  actions?: ReactNode;
};

export function FactoryMultiplierFilterResourceTooltip({
  data,
  link,
  actions,
}: Props) {
  const title = isPopulatedString(data.id) ? shortenUUID(data.id) : "N/A";

  return (
    <ResourceLinkTooltip uuid={data.id!} link={link} actions={actions}>
      <ResourceLinkTooltip.Header
        title={title}
        subTitle={data.description}
        iconSource={SquareAsterisk}
      />

      <ResourceLinkTooltip.Main>
        {data.multiplier?.description && (
          <ResourceLinkTooltip.Item title="Multiplier">
            {data.multiplier?.description}
          </ResourceLinkTooltip.Item>
        )}

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

        {data.description && (
          <ResourceLinkTooltip.Item title="Description">
            {data.description}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
