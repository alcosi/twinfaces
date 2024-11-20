import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { User as UserIcon } from "lucide-react";
import { UserGroup } from "../../api";

type Props = {
  data: UserGroup;
  link: string;
};

export function UserGroupResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={UserIcon}
      />
    </ResourceLinkTooltip>
  );
}
