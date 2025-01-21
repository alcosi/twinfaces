import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { FactoryConditionSet } from "../resource-link";
import { Factory } from "lucide-react";

type Props = {
  data: FactoryConditionSet;
  link: string;
};

export function FactoryConditionSetResourceTooltip({ data, link }: Props) {
  let title: string = "N/A";

  if (isPopulatedString(data.name)) title = data.name;

  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={title}
        subTitle={data.description}
        iconSource={Factory}
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
