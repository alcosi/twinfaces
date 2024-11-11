import { isPopulatedString } from "@/shared/libs";
import { Avatar, ColorTile, ResourceLinkTooltip } from "@/shared/ui";
import { CircleDot } from "lucide-react";
import { TwinClassStatus } from "../../api";

type Props = {
  data: TwinClassStatus;
  link: string;
};

export const TwinClassStatusResourceTooltip = ({ data, link }: Props) => {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        subTitle={data.key}
        iconSource={
          data.logo ? (
            <Avatar url={data.logo} alt={data.name ?? "Logo"} size="xlg" />
          ) : (
            CircleDot
          )
        }
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}
        {data.backgroundColor && (
          <ResourceLinkTooltip.Item title="Background">
            <ColorTile color={data.backgroundColor} />
            {data.backgroundColor}
          </ResourceLinkTooltip.Item>
        )}
        {data.fontColor && (
          <ResourceLinkTooltip.Item title="Font">
            <ColorTile color={data.fontColor} />
            {data.fontColor}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
};
