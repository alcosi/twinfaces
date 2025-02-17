import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { PencilRulerIcon } from "lucide-react";
import { FactoryConditionSet } from "../../api";

type Props = {
  data: FactoryConditionSet;
  link: string;
};

export function FactoryConditionSetResourceTooltip({ data, link }: Props) {
  const title = isPopulatedString(data.name) ? data.name : "N/A";

  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={title}
        subTitle={data.description}
        iconSource={PencilRulerIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.description && (
          <ResourceLinkTooltip.Item title="Description">
            {data.description}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
