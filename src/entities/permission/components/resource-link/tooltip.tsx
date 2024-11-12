import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { Key } from "lucide-react";
import { Permission } from "../../api";

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
        iconSource={Key}
      />

      <ResourceLinkTooltip.Main>
        {data.groupId && (
          <ResourceLinkTooltip.Item title="Group Id">
            <ShortGuidWithCopy value={data.groupId} disableTooltip />
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
