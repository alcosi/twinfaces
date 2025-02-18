import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twin-class";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { Activity } from "lucide-react";
import { TwinFlow_DETAILED } from "../../api";
import { ENTITY_COLOR } from "../../libs";

type Props = {
  data: TwinFlow_DETAILED;
  link: string;
};

export const TwinFlowResourceTooltip = ({ data, link }: Props) => {
  return (
    <ResourceLinkTooltip uuid={data.id} link={link} accentColor={ENTITY_COLOR}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={Activity}
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
