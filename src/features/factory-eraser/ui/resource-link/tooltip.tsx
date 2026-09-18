import { Eraser } from "lucide-react";
import { ReactNode } from "react";

import { FactoryEraser_DETAILED } from "@/entities/factory-eraser";
import { isPopulatedString, shortenUUID } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: FactoryEraser_DETAILED;
  link: string;
  actions?: ReactNode;
};

export function FactoryEraserResourceTooltip({ data, link, actions }: Props) {
  const title = isPopulatedString(data.id) ? shortenUUID(data.id) : "N/A";

  return (
    <ResourceLinkTooltip uuid={data.id!} link={link} actions={actions}>
      <ResourceLinkTooltip.Header
        title={title}
        subTitle={data.description}
        iconSource={Eraser}
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

        {data.action && (
          <ResourceLinkTooltip.Item title="Action">
            {data.action}
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
