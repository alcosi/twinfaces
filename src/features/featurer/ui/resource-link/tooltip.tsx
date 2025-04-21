import { Play } from "lucide-react";

import { Featurer_DETAILED } from "@/entities/featurer";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: Featurer_DETAILED;
  link: string;
};

export const FeaturerResourceTooltip = ({ data, link }: Props) => {
  return (
    <ResourceLinkTooltip uuid={`${data.id}`} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={Play}
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
};
