import { ElementType } from "react";

import { isPopulatedString } from "@/shared/libs";
import { ColorTile, ResourceLinkTooltip } from "@/shared/ui";

import { TwinStatusV2 } from "../../api";
import { ENTITY_COLOR } from "../../libs";

type Props = {
  data: TwinStatusV2;
  link: string;
  IconComponent: ElementType;
};

export const TwinClassStatusResourceTooltip = ({
  data,
  link,
  IconComponent,
}: Props) => {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link} accentColor={ENTITY_COLOR}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        subTitle={data.key}
        iconSource={IconComponent}
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}
        {data.backgroundColor && (
          <ResourceLinkTooltip.Item title="Background">
            <ColorTile color={data.backgroundColor} />
            {data.backgroundColor}
          </ResourceLinkTooltip.Item>
        )}
        {data.fontColor && (
          <ResourceLinkTooltip.Item title="Font">
            <ColorTile color={data.fontColor} />
            {data.fontColor}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
};
