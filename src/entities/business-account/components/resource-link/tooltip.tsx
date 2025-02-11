import { formatToTwinfaceDate, isPopulatedString } from "@/shared/libs";
import { BusinessAccount } from "../../api";
import { ResourceLinkTooltip } from "@/shared/ui";
import { BriefcaseBusinessIcon } from "lucide-react";

type Props = {
  data: BusinessAccount;
  link: string;
};

export function BusinessAccountResourceTooltip({ data, link }: Props) {
  const title = isPopulatedString(data.name) ? data.name : "N/A";

  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={title}
        subTitle={data.name}
        iconSource={BriefcaseBusinessIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.createdAt && (
          <ResourceLinkTooltip.Item title="Created at">
            {formatToTwinfaceDate(data.createdAt)}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
