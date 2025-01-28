import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip, GuidWithCopy } from "@/shared/ui";
import { Puzzle } from "lucide-react";
import { TwinClassField_DETAILED } from "../../api";
import { ENTITY_COLOR } from "../../libs";

type Props = {
  data: TwinClassField_DETAILED;
  link: string;
};

export const TwinClassFieldResourceTooltip = ({ data, link }: Props) => {
  return (
    <ResourceLinkTooltip uuid={data.id} link={link} accentColor={ENTITY_COLOR}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        subTitle={data.key}
        iconSource={Puzzle}
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}

        {data.twinClassId && (
          <ResourceLinkTooltip.Item title="Class Id">
            <GuidWithCopy value={data.twinClassId} />
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
};
