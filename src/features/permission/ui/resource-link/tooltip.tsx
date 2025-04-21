import { Permission } from "@/entities/permission";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { GuidWithCopy } from "@/shared/ui/guid";

import { PermissionIcon } from "../permission-icon";

type Props = {
  data: Permission;
  link: string;
};

export function PermissionResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        subTitle={data.key}
        iconSource={PermissionIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.groupId && (
          <ResourceLinkTooltip.Item title="Group Id">
            <GuidWithCopy value={data.groupId} disableTooltip />
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
