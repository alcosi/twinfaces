import { ReactNode } from "react";

import { PipelineStep_DETAILED } from "@/entities/factory-pipeline-step";
import { isPopulatedString, isUndefined, shortenUUID } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

import { FactoryPipelineStepIcon } from "../factory-pipeline-step-icon";

type Props = {
  data: PipelineStep_DETAILED;
  link: string;
  actions?: ReactNode;
};

export function FactoryPipelineStepResourceTooltip({
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
        iconSource={FactoryPipelineStepIcon}
      />

      <ResourceLinkTooltip.Main>
        {/* Not a truthiness check: the first step of a pipeline is order 0,
            and `0 &&` would print the zero instead of the row. */}
        {!isUndefined(data.order) && (
          <ResourceLinkTooltip.Item title="Order">
            {data.order}
          </ResourceLinkTooltip.Item>
        )}

        {data.factoryConditionSet?.name && (
          <ResourceLinkTooltip.Item title="Condition set name">
            {data.factoryConditionSet?.name}
          </ResourceLinkTooltip.Item>
        )}

        {data.fillerFeaturer?.name && (
          <ResourceLinkTooltip.Item title="Filler">
            {data.fillerFeaturer?.name}
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
