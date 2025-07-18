import { SquareActivity } from "lucide-react";

import { TwinFlowSchema_DETAILED } from "@/entities/twinFlowSchema";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: TwinFlowSchema_DETAILED;
  link: string;
};

export const TwinFlowSchemaResourceTooltip = ({ data, link }: Props) => {
  return (
    <ResourceLinkTooltip uuid={data.id} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={SquareActivity}
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
};
