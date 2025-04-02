import { Play } from "lucide-react";

import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

import { Featurer_DETAILED } from "../../api";

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
