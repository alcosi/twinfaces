import { AsteriskIcon } from "lucide-react";

import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

import { FactoryMultiplier_DETAILED } from "../../api";

type Props = {
  data: FactoryMultiplier_DETAILED;
  link: string;
};

export function FactoryMultiplierResourceTooltip({ data, link }: Props) {
  const title =
    isPopulatedString(data.description) &&
    isPopulatedString(data.inputTwinClass?.name)
      ? `${data.inputTwinClass.name} | ${data.description}`
      : isPopulatedString(data.description)
        ? `N/A | ${data.description}`
        : "N/A";

  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={title}
        subTitle={data.description}
        iconSource={AsteriskIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.factory?.name && (
          <ResourceLinkTooltip.Item title="Factory name">
            {data.factory.name}
          </ResourceLinkTooltip.Item>
        )}
        {data.inputTwinClass?.name && (
          <ResourceLinkTooltip.Item title="Input class name">
            {data.inputTwinClass.name}
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
