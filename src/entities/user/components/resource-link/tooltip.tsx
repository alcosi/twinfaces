import { isPopulatedString } from "@/shared/libs";
import { Avatar, ResourceLinkTooltip } from "@/shared/ui";
import { User as UserIcon } from "lucide-react";
import { User } from "../../libs";

type Props = {
  data: User;
  link: string;
};

export function UserResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        iconSource={
          data.avatar ? (
            <Avatar
              url={data.avatar}
              alt={data.fullName ?? "Avatar"}
              size="xlg"
            />
          ) : (
            UserIcon
          )
        }
      >
        <div className="font-semibold text-lg">
          {isPopulatedString(data.fullName) ? data.fullName : "N/A"}
        </div>
        <div className="text-sm">{data.email}</div>
      </ResourceLinkTooltip.Header>
    </ResourceLinkTooltip>
  );
}
