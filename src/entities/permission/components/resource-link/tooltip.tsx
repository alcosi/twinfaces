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
      <ResourceLinkTooltip.Header iconSource={Key}>
        <div className="font-semibold text-lg truncate whitespace-nowrap">
          {isPopulatedString(data.name) ? data.name : "N/A"}
        </div>
        <div className="text-sm truncate whitespace-nowrap">{data.key}</div>
      </ResourceLinkTooltip.Header>

      <ResourceLinkTooltip.Main>
        {data.groupId && (
          <div className="flex flex-row gap-2 items-center">
            <strong>Group Id:</strong>
            <ShortGuidWithCopy value={data.groupId} disableTooltip />
          </div>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
