import { isPopulatedString } from "@/shared/libs";
import { Avatar, ResourceLinkTooltip } from "@/shared/ui";
import { TwinClass_DETAILED } from "../../api";
import { TwinClassIcon } from "../twin-class-icon";

type Props = {
  data: TwinClass_DETAILED;
  link: string;
};

export const TwinClassResourceTooltip = ({ data, link }: Props) => {
  return (
    <ResourceLinkTooltip uuid={data.id} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        subTitle={data.key}
        iconSource={
          data.logo ? (
            <Avatar url={data.logo} alt={data.name ?? "Logo"} size="xlg" />
          ) : (
            TwinClassIcon
          )
        }
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}
        {data.createdAt && (
          <ResourceLinkTooltip.Item title="Created at">
            {new Date(data.createdAt).toLocaleDateString()}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
};
