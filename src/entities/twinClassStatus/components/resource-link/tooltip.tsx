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
        iconSource={
          data.logo ? (
            <Avatar url={data.logo} alt={data.name ?? "Logo"} size="xlg" />
          ) : (
            CircleDot
          )
        }
      >
        <div className="font-semibold text-lg">
          {isPopulatedString(data.name) ? data.name : "N/A"}
        </div>
        <div className="text-sm">{data.key}</div>
      </ResourceLinkTooltip.Header>

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}
        {data.backgroundColor && (
          <div className="flex flex-row gap-2 items-center">
            <strong>Background:</strong>
            <ColorTile color={data.backgroundColor} />
            {data.backgroundColor}
          </div>
        )}
        {data.fontColor && (
          <div className="flex flex-row gap-2 items-center">
            <strong>Font:</strong>
            <ColorTile color={data.fontColor} />
            {data.fontColor}
          </div>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
};
