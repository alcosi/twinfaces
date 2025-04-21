import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinFlow_DETAILED } from "@/entities/twin-flow";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

import { TwinClassResourceLink } from "../../../../features/twin-class/ui";
import { TwinFlowIcon } from "../twin-flow-icon";

type Props = {
  data: TwinFlow_DETAILED;
  link: string;
};

export const TwinFlowResourceTooltip = ({ data, link }: Props) => {
  return (
    <ResourceLinkTooltip uuid={data.id} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={TwinFlowIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}

        {data.twinClass && (
          <ResourceLinkTooltip.Item title="Class">
            <TwinClassResourceLink
              data={data.twinClass as TwinClass_DETAILED}
            />
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
};
