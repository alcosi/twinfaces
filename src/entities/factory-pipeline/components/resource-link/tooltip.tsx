import { isPopulatedString } from "@/shared/libs";
import { FactoryPipeline } from "../../api";
import { ResourceLinkTooltip } from "@/shared/ui";
import { Check, FootprintsIcon } from "lucide-react";

type Props = {
  data: FactoryPipeline;
  link: string;
};

export function FactoryPipelineResourceTooltip({ data, link }: Props) {
  const title = isPopulatedString(data.id) ? data.id : "N/A";

  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={title}
        subTitle={data.description}
        iconSource={FootprintsIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.description && (
          <ResourceLinkTooltip.Item title="Description">
            {data.description}
          </ResourceLinkTooltip.Item>
        )}

        {data.active && (
          <ResourceLinkTooltip.Item title="Active">
            {data.active.valueOf().toString()}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
