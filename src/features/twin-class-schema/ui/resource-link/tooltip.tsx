import { TwinClassSchema_DETAILED } from "@/entities/twin-class-schema";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

import { TwinClassSchemaIcon } from "../twin-class-schema-icon";

type Props = {
  data: TwinClassSchema_DETAILED;
  link: string;
};

export function TwinClassSchemaResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={TwinClassSchemaIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
