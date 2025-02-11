import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { VenetianMask } from "lucide-react";
import { SpaceRole } from "../../api";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twinClass";

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
