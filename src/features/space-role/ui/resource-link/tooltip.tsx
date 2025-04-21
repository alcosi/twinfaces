import { VenetianMask } from "lucide-react";

import { SpaceRole } from "@/entities/spaceRole";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

import { TwinClassResourceLink } from "../../../../features/twin-class/ui";

type Props = {
  data: SpaceRole;
  link: string;
};

export function SpaceRoleResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : data.key!}
        iconSource={VenetianMask}
      />

      <ResourceLinkTooltip.Main>
        {data.twinClass && (
          <ResourceLinkTooltip.Item title="Class">
            <TwinClassResourceLink
              data={data.twinClass as TwinClass_DETAILED}
            />
          </ResourceLinkTooltip.Item>
        )}

        {data.description && (
          <ResourceLinkTooltip.Item title="Description">
            {data.description}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
