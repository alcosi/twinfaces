import { Factory } from "@/entities/factory";
import { ResourceLinkTooltip } from "@/shared/ui";
import { formatToTwinfaceDate, isPopulatedString } from "@/shared/libs";
import { Factory as FactoryIcon } from "lucide-react";

type Props = {
  data: Factory;
  link: string;
};

export function FactoryResourceTooltip({ data, link }: Props) {
  let title: string = "N/A";
  if (isPopulatedString(data.name)) title = data.name;
  else if (isPopulatedString(data.key)) title = data.key;

  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={title}
        subTitle={data.key}
        iconSource={FactoryIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.description && (
          <ResourceLinkTooltip.Item title="Description">
            {data.description}
          </ResourceLinkTooltip.Item>
        )}

        {data.createdAt && (
          <ResourceLinkTooltip.Item title={"Created At"}>
            {formatToTwinfaceDate(data.createdAt)}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
