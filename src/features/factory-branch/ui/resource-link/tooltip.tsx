import { ReactNode } from "react";

import { FactoryBranch_DETAILED } from "@/entities/factory-branch";
import { isPopulatedString, shortenUUID } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

import { FactoryBranchIcon } from "../factory-branch-icon";

type Props = {
  data: FactoryBranch_DETAILED;
  link: string;
  actions?: ReactNode;
};

export function FactoryBranchResourceTooltip({ data, link, actions }: Props) {
  const title = isPopulatedString(data.id) ? shortenUUID(data.id) : "N/A";

  return (
    <ResourceLinkTooltip uuid={data.id!} link={link} actions={actions}>
      <ResourceLinkTooltip.Header
        title={title}
        subTitle={data.description}
        iconSource={FactoryBranchIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.factory?.name && (
          <ResourceLinkTooltip.Item title="Factory name">
            {data.factory?.name}
          </ResourceLinkTooltip.Item>
        )}

        {data.factoryConditionSet?.name && (
          <ResourceLinkTooltip.Item title="Condition set name">
            {data.factoryConditionSet?.name}
          </ResourceLinkTooltip.Item>
        )}

        {data.nextFactory?.name && (
          <ResourceLinkTooltip.Item title="Next factory">
            {data.nextFactory?.name}
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
