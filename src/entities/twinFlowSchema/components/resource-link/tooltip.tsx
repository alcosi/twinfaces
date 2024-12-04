import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { SquareActivity } from "lucide-react";
import { TwinFlowSchema_DETAILED } from "../../api";
import { ENTITY_COLOR } from "../../libs";

type Props = {
  data: TwinFlowSchema_DETAILED;
  link: string;
};

export const TwinFlowSchemaResourceTooltip = ({ data, link }: Props) => {
  return (
    <ResourceLinkTooltip uuid={data.id} link={link} accentColor={ENTITY_COLOR}>
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
