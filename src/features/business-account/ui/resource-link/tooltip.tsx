import { BriefcaseBusinessIcon } from "lucide-react";

import { BusinessAccount } from "@/entities/business-account";
import { formatIntlDate, isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

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
            {formatIntlDate(data.createdAt, "datetime-local")}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
