import { Tier } from "@/entities/tier";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

import { TierIcon } from "../tier-icon";

type Props = {
  data: Tier;
  link: string;
};

export function TierResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={<TierIcon className="h-9 w-9" />}
      />
    </ResourceLinkTooltip>
  );
}
