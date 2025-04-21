import { User as UserIcon } from "lucide-react";

import { User } from "@/entities/user";
import { isPopulatedString } from "@/shared/libs";
import { Avatar, ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: User;
  link: string;
};

export function UserResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.fullName) ? data.fullName : "N/A"}
        subTitle={data.email}
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
      />
    </ResourceLinkTooltip>
  );
}
