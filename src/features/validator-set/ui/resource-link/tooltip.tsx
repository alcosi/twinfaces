import { Database } from "lucide-react";

import { ValidatorSet_DETAILED } from "@/entities/validator-set";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: ValidatorSet_DETAILED;
  link: string;
};

export function ValidatorSetResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={Database}
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p className="text-xs">{data.description}</p>}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
