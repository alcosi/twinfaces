import { isPopulatedString } from "@/shared/libs";
import { GuidWithCopy, ResourceLinkTooltip } from "@/shared/ui";

import { TwinClassField_DETAILED } from "../../api";
import { FieldIcon } from "../field-icon";

type Props = {
  data: TwinClassField_DETAILED;
  link: string;
};

export const TwinClassFieldResourceTooltip = ({ data, link }: Props) => {
  return (
    <ResourceLinkTooltip uuid={data.id} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        subTitle={data.key}
        iconSource={FieldIcon}
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
